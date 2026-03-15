import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10).max(1000).optional()
})

/**
 * GET /api/products/[id]/reviews
 * Get product reviews with pagination
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const { searchParams } = request.nextUrl
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')
        const skip = (page - 1) * pageSize

        // Get reviews with user info
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: {
                    productId: id,
                    isActive: true
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.review.count({
                where: {
                    productId: id,
                    isActive: true
                }
            })
        ])

        // Calculate rating distribution
        const allReviews = await prisma.review.findMany({
            where: {
                productId: id,
                isActive: true
            },
            select: { rating: true }
        })

        const ratingDistribution = {
            5: allReviews.filter(r => r.rating === 5).length,
            4: allReviews.filter(r => r.rating === 4).length,
            3: allReviews.filter(r => r.rating === 3).length,
            2: allReviews.filter(r => r.rating === 2).length,
            1: allReviews.filter(r => r.rating === 1).length
        }

        const averageRating = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0

        return NextResponse.json({
            data: reviews,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution
        })

    } catch (error) {
        console.error('[REVIEWS_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/products/[id]/reviews
 * Create product review
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validation = createReviewSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { rating, comment } = validation.data

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: id },
            select: { id: true, isActive: true }
        })

        if (!product || !product.isActive) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                productId_userId: {
                    productId: id,
                    userId: session.user.id
                }
            }
        })

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this product' },
                { status: 409 }
            )
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                productId: id,
                userId: session.user.id,
                rating,
                comment
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(review, { status: 201 })

    } catch (error) {
        console.error('[REVIEW_POST_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

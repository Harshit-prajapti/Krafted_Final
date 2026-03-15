import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/products/new-arrivals
 * Public: Get recently added products
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const limit = parseInt(searchParams.get('limit') || '12')
        const days = parseInt(searchParams.get('days') || '30') // Default: last 30 days

        const dateThreshold = new Date()
        dateThreshold.setDate(dateThreshold.getDate() - days)

        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                createdAt: {
                    gte: dateThreshold
                }
            },
            take: limit,
            include: {
                images: {
                    orderBy: { priority: 'asc' }
                },
                categories: {
                    include: { category: true }
                },
                variants: {
                    where: { isActive: true },
                    include: { color: true }
                },
                vendor: {
                    select: {
                        id: true,
                        businessName: true,
                        logo: true
                    }
                },
                reviews: {
                    select: {
                        rating: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Calculate average ratings
        const productsWithRatings = products.map(product => {
            const reviews = product.reviews || []
            const averageRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

            const { reviews: _, ...productData } = product

            return {
                ...productData,
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length
            }
        })

        return NextResponse.json({
            data: productsWithRatings,
            total: productsWithRatings.length
        })

    } catch (error) {
        console.error('[NEW_ARRIVALS_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

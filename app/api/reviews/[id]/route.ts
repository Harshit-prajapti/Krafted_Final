import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(10).max(1000).optional()
})

/**
 * PUT /api/reviews/[id]
 * Update review
 */
export async function PUT(
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
        const validation = updateReviewSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        // Verify review belongs to user
        const existingReview = await prisma.review.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!existingReview) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            )
        }

        // Update review
        const review = await prisma.review.update({
            where: { id: id },
            data: validation.data,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(review)

    } catch (error) {
        console.error('[REVIEW_PUT_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/reviews/[id]
 * Delete review
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify review belongs to user and delete
        const result = await prisma.review.deleteMany({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (result.count === 0) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully'
        })

    } catch (error) {
        console.error('[REVIEW_DELETE_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

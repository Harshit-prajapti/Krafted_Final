import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * DELETE /api/wishlist/[productId]
 * Remove item from wishlist
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    const { productId } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId
                }
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        // If record not found, Prisma throws code P2025. We can return 200/404.
        // For idempotency 200 is often preferred.
        console.error('[WISHLIST_DELETE_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

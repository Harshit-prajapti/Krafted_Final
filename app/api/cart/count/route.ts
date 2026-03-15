import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/cart/count
 * Get current user's cart item count (fast endpoint)
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ count: 0 })
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    select: {
                        quantity: true
                    }
                }
            }
        })

        if (!cart) {
            return NextResponse.json({ count: 0 })
        }

        const count = cart.items.reduce((acc, item) => acc + item.quantity, 0)

        return NextResponse.json({ count })

    } catch (error) {
        console.error('[CART_COUNT_ERROR]', error)
        return NextResponse.json({ count: 0 })
    }
}

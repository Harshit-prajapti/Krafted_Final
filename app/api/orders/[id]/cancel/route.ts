import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * POST /api/orders/[id]/cancel
 * Cancel an order (only if status is CREATED or CONFIRMED)
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

        const order = await prisma.order.findUnique({
            where: { id }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Check if user owns this order
        if (order.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Check if order can be cancelled
        if (order.status !== 'CREATED' && order.status !== 'CONFIRMED') {
            return NextResponse.json(
                { error: 'Order cannot be cancelled at this stage' },
                { status: 400 }
            )
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                history: {
                    create: {
                        status: 'CANCELLED',
                        notes: 'Order cancelled by customer',
                        createdBy: session.user.id
                    }
                }
            }
        })

        return NextResponse.json(updatedOrder)

    } catch (error) {
        console.error('[ORDER_CANCEL_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

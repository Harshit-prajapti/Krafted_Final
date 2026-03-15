import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
    params: Promise<{
        id: string
    }>
}

// GET /api/orders/[id]
// Get single order details
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: { include: { images: true } } }
                }
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Authorization Check: User must own the order OR be ADMIN
        // Note: session.user.id is string, order.userId is string.
        if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json(order)

    } catch (error) {
        console.error('[ORDER_GET_SINGLE_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
// PATCH /api/orders/[id]
// Update order status or payment status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params;
        const body = await request.json()
        const { status, paymentStatus } = body

        const updateData: any = {}
        if (status) updateData.status = status
        if (paymentStatus) updateData.paymentStatus = paymentStatus

        const order = await prisma.order.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(order)

    } catch (error) {
        console.error('[ORDER_PATCH_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createRazorpayOrder } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { orderId } = await request.json()

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                userId: session.user.id
            },
            include: { payments: true }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        if (order.paymentStatus === 'PAID') {
            return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
        }

        const razorpayOrder = await createRazorpayOrder({
            amount: Number(order.totalAmount),
            currency: 'INR',
            receipt: order.id,
            notes: {
                orderId: order.id,
                userId: session.user.id
            }
        })

        await prisma.payment.upsert({
            where: {
                id: order.payments[0]?.id || 'new'
            },
            update: {
                paymentIntentId: razorpayOrder.id,
                status: 'CREATED'
            },
            create: {
                orderId: order.id,
                provider: 'RAZORPAY',
                paymentIntentId: razorpayOrder.id,
                amount: order.totalAmount,
                currency: 'INR',
                status: 'CREATED'
            }
        })

        return NextResponse.json({
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            orderId: order.id
        })

    } catch (error) {
        console.error('[PAYMENT_CREATE_ERROR]', error)
        return NextResponse.json(
            { error: 'Failed to create payment order' },
            { status: 500 }
        )
    }
}

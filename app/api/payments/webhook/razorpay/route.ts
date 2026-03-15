import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('x-razorpay-signature')

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
        }

        const isValid = verifyWebhookSignature(body, signature)
        if (!isValid) {
            console.error('[RAZORPAY_WEBHOOK] Invalid signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const payload = JSON.parse(body)
        const event = payload.event
        const paymentEntity = payload.payload?.payment?.entity

        if (!paymentEntity) {
            return NextResponse.json({ received: true })
        }

        const razorpayOrderId = paymentEntity.order_id
        const razorpayPaymentId = paymentEntity.id
        const status = paymentEntity.status

        const payment = await prisma.payment.findFirst({
            where: { paymentIntentId: razorpayOrderId },
            include: { order: true }
        })

        if (!payment) {
            console.error('[RAZORPAY_WEBHOOK] Payment not found for order:', razorpayOrderId)
            return NextResponse.json({ received: true })
        }

        if (event === 'payment.captured') {
            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'SUCCESS',
                        transactionId: razorpayPaymentId,
                        rawResponse: paymentEntity
                    }
                })

                await tx.order.update({
                    where: { id: payment.orderId },
                    data: {
                        status: 'CONFIRMED',
                        paymentStatus: 'PAID'
                    }
                })

                await tx.paymentHistory.create({
                    data: {
                        paymentId: payment.id,
                        status: 'SUCCESS',
                        notes: 'Payment captured via webhook',
                        metadata: { event, razorpayPaymentId }
                    }
                })

                await tx.orderHistory.create({
                    data: {
                        orderId: payment.orderId,
                        status: 'CONFIRMED',
                        notes: 'Payment captured. Order confirmed via webhook.',
                        createdBy: 'SYSTEM'
                    }
                })

                const cart = await tx.cart.findUnique({
                    where: { userId: payment.order.userId }
                })
                if (cart) {
                    await tx.cartItem.deleteMany({
                        where: { cartId: cart.id }
                    })
                }
            })

            console.log('[RAZORPAY_WEBHOOK] Payment captured:', razorpayPaymentId)
        }

        if (event === 'payment.failed') {
            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'FAILED',
                        rawResponse: paymentEntity
                    }
                })

                await tx.order.update({
                    where: { id: payment.orderId },
                    data: {
                        paymentStatus: 'FAILED'
                    }
                })

                await tx.paymentHistory.create({
                    data: {
                        paymentId: payment.id,
                        status: 'FAILED',
                        notes: paymentEntity.error_description || 'Payment failed',
                        metadata: { event, error: paymentEntity.error_code }
                    }
                })
            })

            console.log('[RAZORPAY_WEBHOOK] Payment failed:', razorpayPaymentId)
        }

        return NextResponse.json({ received: true })

    } catch (error) {
        console.error('[RAZORPAY_WEBHOOK_ERROR]', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}

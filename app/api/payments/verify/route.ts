import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { verifyPaymentSignature } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = await request.json()

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
        }

        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: {
                    id: orderId,
                    userId: session.user.id
                },
                data: {
                    status: 'CONFIRMED',
                    paymentStatus: 'PAID'
                }
            })

            await tx.payment.updateMany({
                where: {
                    orderId: orderId,
                    paymentIntentId: razorpay_order_id
                },
                data: {
                    status: 'SUCCESS',
                    transactionId: razorpay_payment_id,
                    rawResponse: {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        verified_at: new Date().toISOString()
                    }
                }
            })

            const payment = await tx.payment.findFirst({
                where: { orderId, paymentIntentId: razorpay_order_id }
            })

            if (payment) {
                await tx.paymentHistory.create({
                    data: {
                        paymentId: payment.id,
                        status: 'SUCCESS',
                        notes: 'Payment verified successfully',
                        metadata: {
                            razorpay_payment_id,
                            verified_by: 'client'
                        }
                    }
                })
            }

            await tx.orderHistory.create({
                data: {
                    orderId: orderId,
                    status: 'CONFIRMED',
                    notes: 'Payment received. Order confirmed.',
                    createdBy: session.user.id
                }
            })

            const cart = await tx.cart.findUnique({
                where: { userId: session.user.id }
            })

            if (cart) {
                await tx.cartItem.deleteMany({
                    where: { cartId: cart.id }
                })
            }

            return order
        })

        return NextResponse.json({
            success: true,
            orderId: result.id,
            message: 'Payment verified successfully'
        })

    } catch (error) {
        console.error('[PAYMENT_VERIFY_ERROR]', error)
        return NextResponse.json(
            { error: 'Payment verification failed' },
            { status: 500 }
        )
    }
}

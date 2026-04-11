import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { verifyPaymentSignature } from '@/lib/razorpay'

async function finalizeSuccessfulPayment({
    orderId,
    userId,
    paymentIntentId,
    transactionId,
    rawResponse,
    paymentHistoryNote,
    orderHistoryNote,
}: {
    orderId: string
    userId: string
    paymentIntentId?: string
    transactionId: string
    rawResponse: Record<string, string>
    paymentHistoryNote: string
    orderHistoryNote: string
}) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
            where: {
                id: orderId,
                userId
            },
            data: {
                status: 'CONFIRMED',
                paymentStatus: 'PAID'
            }
        })

        await tx.payment.updateMany({
            where: {
                orderId,
                ...(paymentIntentId ? { paymentIntentId } : {})
            },
            data: {
                status: 'SUCCESS',
                transactionId,
                rawResponse
            }
        })

        const payment = await tx.payment.findFirst({
            where: {
                orderId,
                ...(paymentIntentId ? { paymentIntentId } : {})
            }
        })

        if (payment) {
            await tx.paymentHistory.create({
                data: {
                    paymentId: payment.id,
                    status: 'SUCCESS',
                    notes: paymentHistoryNote,
                    metadata: rawResponse
                }
            })
        }

        await tx.orderHistory.create({
            data: {
                orderId,
                status: 'CONFIRMED',
                notes: orderHistoryNote,
                createdBy: userId
            }
        })

        const cart = await tx.cart.findUnique({
            where: { userId }
        })

        if (cart) {
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            })
        }

        return order
    })
}

async function finalizeFailedPayment({
    orderId,
    userId,
    paymentIntentId,
    transactionId,
    rawResponse,
    paymentHistoryNote,
}: {
    orderId: string
    userId: string
    paymentIntentId?: string
    transactionId?: string
    rawResponse: Record<string, string>
    paymentHistoryNote: string
}) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
            where: {
                id: orderId,
                userId
            },
            data: {
                paymentStatus: 'FAILED'
            }
        })

        await tx.payment.updateMany({
            where: {
                orderId,
                ...(paymentIntentId ? { paymentIntentId } : {})
            },
            data: {
                status: 'FAILED',
                transactionId: transactionId || null,
                rawResponse
            }
        })

        const payment = await tx.payment.findFirst({
            where: {
                orderId,
                ...(paymentIntentId ? { paymentIntentId } : {})
            }
        })

        if (payment) {
            await tx.paymentHistory.create({
                data: {
                    paymentId: payment.id,
                    status: 'FAILED',
                    notes: paymentHistoryNote,
                    metadata: rawResponse
                }
            })
        }

        return order
    })
}

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
            orderId,
            paymentMode,
            paymentStatus,
            testPaymentId,
            testOrderId,
            errorCode,
            errorDescription,
        } = await request.json()

        const isPaymentTestMode =
            process.env.PAYMENT_TEST_MODE === 'true' && session.user.role === 'ADMIN'

        if (paymentMode === 'TEST') {
            if (!isPaymentTestMode) {
                return NextResponse.json({ error: 'Test payment mode is disabled' }, { status: 400 })
            }

            if (!orderId) {
                return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
            }

            const transactionId = testPaymentId || `test_payment_${orderId.slice(-12)}`
            const paymentIntentId = testOrderId || `test_order_${orderId.slice(-12)}`

            const result = await finalizeSuccessfulPayment({
                orderId,
                userId: session.user.id,
                paymentIntentId,
                transactionId,
                rawResponse: {
                    mode: 'TEST',
                    verified_at: new Date().toISOString(),
                    verified_by: 'server_test_mode'
                },
                paymentHistoryNote: 'Payment marked successful in test mode',
                orderHistoryNote: 'Payment test completed. Order confirmed.',
            })

            return NextResponse.json({
                success: true,
                orderId: result.id,
                message: 'Test payment verified successfully'
            })
        }

        if (paymentStatus === 'FAILED') {
            if (!orderId) {
                return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
            }

            const failurePayload = Object.entries({
                mode: 'LIVE',
                razorpay_order_id,
                razorpay_payment_id,
                errorCode,
                errorDescription,
                verified_at: new Date().toISOString(),
                verified_by: 'client_failure_handler'
            }).reduce<Record<string, string>>((acc, [key, value]) => {
                if (typeof value === 'string' && value.length > 0) {
                    acc[key] = value
                }

                return acc
            }, {})

            const result = await finalizeFailedPayment({
                orderId,
                userId: session.user.id,
                paymentIntentId: razorpay_order_id,
                transactionId: razorpay_payment_id,
                rawResponse: failurePayload,
                paymentHistoryNote: errorDescription || 'Payment failed before verification',
            })

            return NextResponse.json({
                success: false,
                orderId: result.id,
                message: 'Payment failure recorded'
            })
        }

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

        const result = await finalizeSuccessfulPayment({
            orderId,
            userId: session.user.id,
            paymentIntentId: razorpay_order_id,
            transactionId: razorpay_payment_id,
            rawResponse: {
                mode: 'LIVE',
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                verified_at: new Date().toISOString(),
                verified_by: 'client'
            },
            paymentHistoryNote: 'Payment verified successfully',
            orderHistoryNote: 'Payment received. Order confirmed.',
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

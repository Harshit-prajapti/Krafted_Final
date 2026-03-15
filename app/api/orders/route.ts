import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: { product: { select: { name: true, images: true } } }
                },
                shippingAddress: true,
                payments: {
                    select: { id: true, status: true, transactionId: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(orders)

    } catch (error) {
        console.error('[ORDERS_GET_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { addressId, paymentMethod } = body

        if (!addressId) {
            return NextResponse.json({ error: 'Address ID is required' }, { status: 400 })
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: { include: { color: true } }
                    }
                }
            }
        })

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        let totalAmount = 0
        const orderItemsData = cart.items.map(item => {
            const price = Number(item.variant?.price || item.product.basePrice)
            totalAmount += price * item.quantity

            return {
                productId: item.productId,
                variantId: item.variantId,
                productName: item.product.name,
                sku: item.variant?.sku || null,
                colorName: item.variant?.color?.name || null,
                size: item.variant?.size || null,
                material: item.variant?.material || item.product.material || null,
                price: price,
                quantity: item.quantity
            }
        })

        // Now we will Add GST in the total amount
        totalAmount += totalAmount * 0.18

        if (paymentMethod === 'COD') {
            return NextResponse.json({ error: 'Cash on Delivery is currently unavailable' }, { status: 400 })
        }

        const isCOD = false

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    totalAmount: totalAmount,
                    status: isCOD ? 'CONFIRMED' : 'CREATED',
                    paymentStatus: isCOD ? 'PENDING' : 'PENDING',
                    shippingAddressId: addressId,
                    billingAddressId: addressId,
                    items: {
                        create: orderItemsData
                    }
                },
                include: {
                    items: true,
                    shippingAddress: true
                }
            })

            await tx.payment.create({
                data: {
                    orderId: newOrder.id,
                    provider: isCOD ? 'OTHER' : 'RAZORPAY',
                    amount: totalAmount,
                    currency: 'INR',
                    status: 'CREATED'
                }
            })

            await tx.orderHistory.create({
                data: {
                    orderId: newOrder.id,
                    status: isCOD ? 'CONFIRMED' : 'CREATED',
                    notes: isCOD ? 'Order placed with Cash on Delivery' : 'Order created. Awaiting payment.',
                    createdBy: session.user.id
                }
            })

            if (isCOD) {
                await tx.cartItem.deleteMany({
                    where: { cartId: cart.id }
                })
            }

            return newOrder
        })

        return NextResponse.json({
            id: order.id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: Number(order.totalAmount),
            requiresPayment: !isCOD,
            items: order.items,
            shippingAddress: order.shippingAddress
        }, { status: 201 })

    } catch (error) {
        console.error('[ORDERS_POST_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

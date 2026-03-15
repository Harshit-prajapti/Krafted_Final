import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // 1. Products in Carts (Potential Sales)
        // Group by product and count
        const cartItems = await prisma.cartItem.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        basePrice: true,
                        images: {
                            where: { isPrimary: true },
                            take: 1
                        }
                    }
                },
                cart: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        })
        console.log(cartItems)

        // Aggregation logic
        const productInterest = cartItems.reduce((acc: any, item) => {
            const pid = item.productId
            if (!acc[pid]) {
                acc[pid] = {
                    product: item.product,
                    inCarts: 0,
                    interestedUsers: []
                }
            }
            acc[pid].inCarts += item.quantity
            acc[pid].interestedUsers.push(item.cart.user)
            return acc
        }, {})

        // 2. Wishlist Stats
        const wishlistItems = await prisma.wishlistItem.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        images: {
                            where: { isPrimary: true },
                            take: 1
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })

        const wishlistInterest = wishlistItems.reduce((acc: any, item) => {
            const pid = item.productId
            if (!acc[pid]) {
                acc[pid] = {
                    product: item.product,
                    inWishlists: 0,
                    interestedUsers: []
                }
            }
            acc[pid].inWishlists += 1
            acc[pid].interestedUsers.push(item.user)
            return acc
        }, {})

        // Merge or format as needed
        const performanceData = {
            cartInterest: Object.values(productInterest),
            wishlistInterest: Object.values(wishlistInterest)
        }

        return NextResponse.json(performanceData)

    } catch (error) {
        console.error('[ADMIN_ANALYTICS_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CartResponse } from '@/types/cart'

export async function getCart(): Promise<CartResponse | null> {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return null
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: {
                                    orderBy: { priority: 'asc' },
                                    take: 1
                                }
                            }
                        },
                        variant: {
                            include: {
                                color: true
                            }
                        }
                    }
                }
            }
        })

        if (!cart) {
            return null
        }

        const subtotal = cart.items.reduce((acc, item) => {
            const price = item.variant?.price
                ? Number(item.variant.price)
                : Number(item.product.basePrice)
            return acc + (price * item.quantity)
        }, 0)

        const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0)

        return {
            id: cart.id,
            userId: cart.userId,
            updatedAt: cart.updatedAt.toISOString(),
            subtotal,
            itemCount,
            items: cart.items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                    basePrice: Number(item.product.basePrice),
                    images: item.product.images.map(img => ({
                        imageUrl: img.imageUrl,
                        altText: img.altText
                    }))
                },
                variant: item.variant ? {
                    id: item.variant.id,
                    size: item.variant.size,
                    material: item.variant.material,
                    price: item.variant.price ? Number(item.variant.price) : null,
                    color: item.variant.color ? {
                        name: item.variant.color.name,
                        hexCode: item.variant.color.hexCode
                    } : null
                } : null
            }))
        }
    } catch (error) {
        console.error('[CART_GET_ERROR]', error)
        return null
    }
}

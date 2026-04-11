import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const addToCartSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().min(1).default(1),
    variantId: z.string().optional().nullable(),
    selectedColor: z.object({
        id: z.string(),
        name: z.string(),
        hexCode: z.string()
    }).optional().nullable()
})

/**
 * GET /api/cart
 * Get current user's cart with details
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            console.log('No session found', session)

            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
            // Return empty cart structure if none exists
            return NextResponse.json({
                id: null,
                items: [],
                subtotal: 0,
                itemCount: 0
            })
        }

        // Calculate totals helper
        const subtotal = cart.items.reduce((acc, item) => {
            // Use variant price if available, otherwise use product basePrice
            const price = item.variant?.price
                ? Number(item.variant.price)
                : Number(item.product.basePrice)
            return acc + (price * item.quantity)
        }, 0)

        const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0)

        return NextResponse.json({
            ...cart,
            subtotal,
            itemCount
        })

    } catch (error) {
        console.error('[CART_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Adding to cart:', body);
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const validation = addToCartSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { productId, selectedColor, quantity, variantId } = validation.data

        // 1. Get or Create Cart
        let cart = await prisma.cart.findUnique({
            where: { userId: session.user.id }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.user.id }
            })
        }
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                variants: {
                    where: { isActive: true },
                    orderBy: [{ colorId: 'asc' }, { createdAt: 'asc' }]
                }
            }
        })

        if (!product || !product.isActive) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        let resolvedVariantId: string | null = null

        if (variantId) {
            const variant = product.variants.find((item) => item.id === variantId)
            if (!variant) {
                return NextResponse.json(
                    { error: 'Variant not found' },
                    { status: 404 }
                )
            }
            resolvedVariantId = variant.id
        } else if (selectedColor?.id) {
            const variant = product.variants.find((item) => item.colorId === selectedColor.id)
            if (!variant) {
                return NextResponse.json(
                    { error: 'Variant not found' },
                    { status: 404 }
                )
            }
            resolvedVariantId = variant.id
        } else if (product.variants.length > 0) {
            resolvedVariantId = product.variants[0].id
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId,
                variantId: resolvedVariantId
            }
        })

        let cartItem;
        if (existingItem) {
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            })
        } else {
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    variantId: resolvedVariantId,
                    quantity
                }
            })
        }

        return NextResponse.json(cartItem)

    } catch (error) {
        console.error('[CART_POST_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { itemId, quantity } = body

        if (!itemId || !quantity || quantity < 1) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        })

        if (!cartItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        if (cartItem.cart.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        })

        return NextResponse.json(updatedItem)

    } catch (error) {
        console.error('[CART_PATCH_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { itemId } = body

        if (!itemId) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        })

        if (!cartItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        if (cartItem.cart.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        await prisma.cartItem.delete({
            where: { id: itemId }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[CART_DELETE_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const updateQuantitySchema = z.object({
    quantity: z.number().int().min(1).max(99)
})

/**
 * PUT /api/cart/[itemId]
 * Update cart item quantity
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    const { itemId } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validation = updateQuantitySchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { quantity } = validation.data

        // Verify item belongs to user's cart
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId: session.user.id
                }
            }
        })

        if (!cartItem) {
            return NextResponse.json(
                { error: 'Cart item not found' },
                { status: 404 }
            )
        }

        // Update quantity
        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
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
                    include: { color: true }
                }
            }
        })

        return NextResponse.json(updatedItem)

    } catch (error) {
        console.error('[CART_ITEM_PUT_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/cart/[itemId]
 * Remove item from cart
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    const { itemId } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify item belongs to user's cart
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId: session.user.id
                }
            }
        })

        if (!cartItem) {
            return NextResponse.json(
                { error: 'Cart item not found' },
                { status: 404 }
            )
        }

        // Delete item
        await prisma.cartItem.delete({
            where: { id: itemId }
        })

        return NextResponse.json({
            success: true,
            message: 'Item removed from cart'
        })

    } catch (error) {
        console.error('[CART_ITEM_DELETE_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

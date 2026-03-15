import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const wishlistSchema = z.object({
    productId: z.string()
})

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json([], { status: 200 })
        }

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        basePrice: true,
                        images: {
                            take: 1,
                            orderBy: { priority: 'asc' },
                            select: {
                                imageUrl: true,
                                altText: true
                            }
                        },
                        categories: {
                            include: { category: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Transform to match expected hook structure
        const transformedItems = wishlistItems.map(item => ({
            ...item,
            product: {
                ...item.product,
                price: Number(item.product.basePrice),
                images: item.product.images.map(img => ({
                    url: img.imageUrl,
                    alt: img.altText
                }))
            }
        }))

        return NextResponse.json(transformedItems, {
            headers: {
                'Cache-Control': 'private, max-age=60, stale-while-revalidate=300'
            }
        })

    } catch (error) {
        console.error('[WISHLIST_GET_ERROR]', error)
        return NextResponse.json([], { status: 200 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validation = wishlistSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { productId } = validation.data

        if (!session.user?.id) {
            console.error('[WISHLIST_POST_ERROR] User ID missing in session')
            return NextResponse.json({ error: 'Unauthorized: User ID missing' }, { status: 401 })
        }

        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        const existing = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId
                }
            }
        })

        if (existing) {
            return NextResponse.json(
                { message: 'Item already in wishlist', item: existing },
                { status: 200 }
            )
        }

        const item = await prisma.wishlistItem.create({
            data: {
                user: { connect: { id: session.user.id } },
                product: { connect: { id: productId } }
            },
            include: {
                product: {
                    include: {
                        images: { take: 1 }
                    }
                }
            }
        })

        return NextResponse.json({ success: true, item }, { status: 201 })

    } catch (error) {
        console.error('[WISHLIST_POST_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

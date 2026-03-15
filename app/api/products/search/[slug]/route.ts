import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Schema for Product Updates
const productUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().or(z.string().transform(v => Number(v))).optional(),
    isActive: z.boolean().optional(),
    material: z.string().optional(),
    dimensions: z.string().optional(),
})

interface RouteParams {
    params: Promise<{
        slug: string
    }>
}

/**
 * GET /api/products/[slug]
 * Public: Get single product details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        console.log('[PRODUCT_GET_SINGLE]', params);
        const { slug } = await params;

        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                categories: {
                    include: { category: true }
                },
                variants: {
                    include: { color: true }
                },
                images: {
                    orderBy: { priority: 'asc' }
                },
            }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(product)

    } catch (error) {
        console.error('[PRODUCT_GET_SINGLE_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/products/[slug]
 * Admin Only: Update product
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        // 1. Auth
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { slug } = await params;

        // 2. Validate
        const body = await request.json()
        const validation = productUpdateSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const data = validation.data

        // 3. Update
        const updatedProduct = await prisma.product.update({
            where: { slug },
            data: data
        })

        return NextResponse.json(updatedProduct)

    } catch (error) {
        console.error('[PRODUCT_UPDATE_ERROR]', error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/products/[slug]
 * Admin Only: Delete product
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { slug } = await params;

        await prisma.product.delete({
            where: { slug }
        })

        return NextResponse.json({ message: 'Product deleted successfully' })

    } catch (error) {
        console.error('[PRODUCT_DELETE_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

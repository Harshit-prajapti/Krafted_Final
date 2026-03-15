import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { buildProductWhereClause } from '@/lib/product-filters'

// Helper to generate SKU
const generateSku = (slug: string, colorId: string) => {
    // Take first 3 chars of slug (or random if short)
    const slugPrefix = slug.length >= 3 ? slug.substring(0, 3).toUpperCase() : slug.toUpperCase().padEnd(3, 'X');
    // Take last 4 chars of colorId
    const colorSuffix = colorId.length > 4 ? colorId.slice(-4).toUpperCase() : Math.random().toString(36).substring(2, 6).toUpperCase();
    // Add random 4 chars for uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `${slugPrefix}-${colorSuffix}-${randomSuffix}`;
}

// Schema for Product Creation - Matching Frontend
const productSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(10),
    basePrice: z.number().or(z.string().transform(v => parseFloat(v))),
    material: z.string().optional(),
    dimensions: z.string().optional(),
    isActive: z.boolean().default(true),
    categoryIds: z.array(z.string()).min(1, "At least one category is required"),
    colorIds: z.array(z.string()).optional().default([]),
    images: z.array(z.object({
        imageUrl: z.string().url(),
        altText: z.string().optional(),
        isPrimary: z.boolean().default(false),
        priority: z.number().default(5)
    })).optional()
})

/**
 * GET /api/products
 * Public: List products with advanced filtering
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const params = {
            categoryId: searchParams.get('categoryId'),
            colorId: searchParams.get('colorId'),
            vendorId: searchParams.get('vendorId'),
            minPrice: searchParams.get('minPrice'),
            maxPrice: searchParams.get('maxPrice'),
            search: searchParams.get('search'),
            isActive: searchParams.get('isActive'),
            featured: searchParams.get('featured')
        }

        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = searchParams.get('sortOrder') || 'desc'
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '20')

        // Build Where Clause
        const where = buildProductWhereClause(params)

        // Sorting
        let orderBy: any = { createdAt: 'desc' }
        if (sortBy === 'price') {
            orderBy = { basePrice: sortOrder }
        } else if (sortBy === 'name') {
            orderBy = { name: sortOrder }
        } else if (sortBy === 'createdAt') {
            orderBy = { createdAt: sortOrder }
        }

        // Pagination
        const skip = (page - 1) * pageSize

        // Execute Query
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    images: {
                        orderBy: { priority: 'asc' }
                    },
                    categories: {
                        include: { category: true }
                    },
                    variants: {
                        where: { isActive: true },
                        include: { color: true }
                    },
                    vendor: {
                        select: {
                            id: true,
                            businessName: true,
                            logo: true
                        }
                    },
                    reviews: {
                        select: {
                            rating: true
                        }
                    }
                },
                orderBy
            }),
            prisma.product.count({ where })
        ])

        // Calculate average ratings
        const productsWithRatings = products.map(product => {
            const reviews = product.reviews || []
            const averageRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

            const { reviews: _, ...productData } = product

            return {
                ...productData,
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length
            }
        })

        return NextResponse.json({
            data: productsWithRatings,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        })

    } catch (error) {
        console.error('[PRODUCTS_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/products
 * Admin Only: Create new product
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Auth
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
        }

        // 2. Validate
        const body = await request.json()
        const validation = productSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const data = validation.data

        // 3. Create Product with Relations
        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                basePrice: data.basePrice,
                material: data.material,
                dimensions: data.dimensions,
                isActive: data.isActive,
                // Nested writes
                categories: {
                    create: data.categoryIds.map(id => ({ categoryId: id }))
                },
                // Create variants for each color
                variants: {
                    create: data.colorIds.map(colorId => ({
                        colorId: colorId,
                        sku: generateSku(data.slug, colorId),
                        price: data.basePrice, // Default variant price to base price
                        isActive: true
                    }))
                },
                images: {
                    create: data.images
                }
            },
            include: {
                categories: true,
                images: true,
                variants: true
            }
        })

        return NextResponse.json(product, { status: 201 })

    } catch (error) {
        console.error('[PRODUCTS_POST_ERROR]', error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
            }
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}


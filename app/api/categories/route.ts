import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Schema for Category Creation/Update
const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    type: z.enum(["PRODUCT_TYPE", "ROOM", "STYLE", "CAMPAIGN"]),
    parentId: z.string().optional().nullable(),
    isActive: z.boolean().optional().default(true),
})

/**
 * GET /api/categories
 * Public: List categories
 * Query params: type, parentId, isActive, includeChildren
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const type = searchParams.get('type')
        const parentId = searchParams.get('parentId')
        const isActive = searchParams.get('isActive')
        const includeChildren = searchParams.get('includeChildren') === 'true'

        // Build filter object dynamically
        const where: any = {}
        if (type) where.type = type
        if (parentId) where.parentId = parentId
        if (isActive !== null) where.isActive = isActive === 'true'

        // Fetch categories from Prisma
        const categories = await prisma.category.findMany({
            where,
            include: {
                children: includeChildren, // Include sub-categories if requested
                _count: {
                    select: { products: true } // Include count of products
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(categories)
    } catch (error) {
        console.error('[CATEGORIES_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { getCategoryBranchSummary } from '@/lib/category-queries'

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
        const type = searchParams.get('type') as z.infer<typeof categorySchema>['type'] | null
        const parentId = searchParams.get('parentId')
        const isActive = searchParams.get('isActive')
        const includeChildren = searchParams.get('includeChildren') === 'true'

        // Build filter object dynamically
        const where: any = {}
        if (type) where.type = type
        if (parentId) {
            where.parents = {
                some: { parentId }
            }
        }
        if (isActive !== null) where.isActive = isActive === 'true'

        const fetchCategories = (queryWhere: typeof where) => prisma.category.findMany({
            where: queryWhere,
            include: {
                children: includeChildren
                    ? {
                        include: {
                            child: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    isActive: true,
                                }
                            }
                        }
                    }
                    : undefined,
                _count: {
                    select: { products: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        // Fetch categories from Prisma
        let categories = await fetchCategories(where)

        if (!parentId && categories.length === 0) {
            categories = await fetchCategories({
                ...(type ? { type } : {}),
                ...(isActive !== null ? { isActive: isActive === 'true' } : {}),
            } as typeof where)
        }

        const serializedCategories = await Promise.all(
            categories.map(async (category) => {
                const summary = await getCategoryBranchSummary(category.id)

                return {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    type: category.type,
                    isActive: category.isActive,
                    children: includeChildren ? category.children : undefined,
                    _count: {
                        products: summary.total,
                        children: Array.isArray(category.children) ? category.children.length : 0,
                    },
                    coverImage: summary.coverImage,
                }
            })
        )

        return NextResponse.json(serializedCategories)
    } catch (error) {
        console.error('[CATEGORIES_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

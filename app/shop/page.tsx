import { prisma } from '@/lib/prisma'
import ShopClient from '@/components/shop/ShopClient'
import { buildProductWhereClause } from '@/lib/product-filters'
import { serialize } from '@/lib/serialize'

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function ShopPage({ searchParams }: { searchParams: any }) {
    // Parse multi-select filters
    const categoryIds = searchParams.categoryId
        ? Array.isArray(searchParams.categoryId)
            ? searchParams.categoryId
            : [searchParams.categoryId]
        : undefined

    const colorIds = searchParams.colorId
        ? Array.isArray(searchParams.colorId)
            ? searchParams.colorId
            : [searchParams.colorId]
        : undefined

    const materials = searchParams.material
        ? Array.isArray(searchParams.material)
            ? searchParams.material
            : [searchParams.material]
        : undefined

    const where = buildProductWhereClause({
        categoryId: categoryIds,
        colorId: colorIds,
        material: materials,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        search: searchParams.search,
        isActive: 'true'
    })

    const sortBy = searchParams.sortBy || 'createdAt'
    const sortOrder = searchParams.sortOrder || 'desc'

    const initialProducts = await prisma.product.findMany({
        where,
        take: 12,
        include: {
            images: {
                take: 1,
                orderBy: { priority: 'asc' }
            },
            categories: {
                include: { category: true }
            }
        },
        orderBy: { [sortBy === 'price' ? 'basePrice' : sortBy]: sortOrder },
    })

    const totalCount = await prisma.product.count({ where })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-16">
            <div className="container mx-auto px-4">
                <ShopClient
                    initialProducts={serialize(initialProducts) as any}
                    initialTotal={totalCount}
                    filters={searchParams}
                />
            </div>
        </div>
    )
}

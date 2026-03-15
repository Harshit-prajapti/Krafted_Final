import { Prisma } from '@prisma/client'

export interface ProductFilterParams {
    categoryId?: string | string[] | null
    colorId?: string | string[] | null
    vendorId?: string | null
    material?: string | string[] | null
    minPrice?: string | null
    maxPrice?: string | null
    search?: string | null
    isActive?: string | null
    featured?: string | null
}

export function buildProductWhereClause(params: ProductFilterParams): Prisma.ProductWhereInput {
    const {
        categoryId,
        colorId,
        vendorId,
        material,
        minPrice,
        maxPrice,
        search,
        isActive
    } = params

    const where: Prisma.ProductWhereInput = {}

    // Active Status
    if (isActive !== null && isActive !== undefined) {
        where.isActive = isActive === 'true'
    } else {
        where.isActive = true
    }

    // Category Filter - support single or multiple
    if (categoryId) {
        const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId]
        if (categoryIds.length > 0) {
            where.categories = {
                some: {
                    categoryId: { in: categoryIds }
                }
            }
        }
    }

    // Color Filter - support single or multiple (via Variants)
    if (colorId) {
        const colorIds = Array.isArray(colorId) ? colorId : [colorId]
        if (colorIds.length > 0) {
            where.variants = {
                some: {
                    colorId: { in: colorIds }
                }
            }
        }
    }

    // Material Filter - support single or multiple
    if (material) {
        const materials = Array.isArray(material) ? material : [material]
        if (materials.length > 0) {
            where.material = { in: materials }
        }
    }

    // Vendor Filter
    if (vendorId) {
        where.vendorId = vendorId
    }

    // Price Filter
    if (minPrice || maxPrice) {
        where.basePrice = {}
        if (minPrice) where.basePrice.gte = Number(minPrice)
        if (maxPrice) where.basePrice.lte = Number(maxPrice)
    }

    // Search Query
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ]
    }

    return where
}

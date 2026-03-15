import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/products/featured
 * Public: Get featured/bestselling products
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const limit = parseInt(searchParams.get('limit') || '12')

        // Get products sorted by review count and rating
        const products = await prisma.product.findMany({
            where: { isActive: true },
            take: limit,
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
            }
        })

        // Calculate ratings and sort by popularity
        const productsWithRatings = products.map(product => {
            const reviews = product.reviews || []
            const averageRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

            const { reviews: _, ...productData } = product

            return {
                ...productData,
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length,
                popularityScore: (averageRating * reviews.length) // Simple popularity metric
            }
        })

        // Sort by popularity score
        const sortedProducts = productsWithRatings.sort((a, b) =>
            b.popularityScore - a.popularityScore
        )

        // Remove popularity score from response
        const finalProducts = sortedProducts.map(({ popularityScore, ...product }) => product)

        return NextResponse.json({
            data: finalProducts,
            total: finalProducts.length
        })

    } catch (error) {
        console.error('[FEATURED_PRODUCTS_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateRelevanceScore, getDidYouMeanSuggestion } from '@/lib/search-utils'

/**
 * GET /api/products/search
 * Enhanced search with relevance scoring, category suggestions, and fuzzy matching
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const query = searchParams.get('q') || ''
        const limit = parseInt(searchParams.get('limit') || '10')
        const includeCategories = searchParams.get('includeCategories') === 'true'

        if (!query || query.length < 2) {
            return NextResponse.json({
                products: [],
                categories: [],
                suggestion: null
            })
        }

        // Search products with fuzzy matching
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { material: { contains: query, mode: 'insensitive' } },
                    {
                        categories: {
                            some: {
                                category: {
                                    name: { contains: query, mode: 'insensitive' }
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                images: {
                    orderBy: { priority: 'asc' },
                    take: 1
                },
                categories: {
                    include: { category: true }
                }
            },
            take: limit
        })

        // Calculate relevance scores and sort
        const productsWithScores = products
            .map(product => ({
                ...product,
                relevanceScore: calculateRelevanceScore(product, query)
            }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore)

        // Search categories if requested
        let categories: any[] = []
        if (includeCategories) {
            categories = await prisma.category.findMany({
                where: {
                    isActive: true,
                    name: { contains: query, mode: 'insensitive' }
                },
                include: {
                    _count: {
                        select: { products: true }
                    }
                },
                take: 5
            })
        }

        // Get "Did you mean?" suggestion
        const commonTerms = await prisma.product.findMany({
            where: { isActive: true },
            select: { name: true },
            take: 100
        })

        const suggestion = getDidYouMeanSuggestion(
            query,
            commonTerms.map(p => p.name)
        )

        return NextResponse.json({
            products: productsWithScores,
            categories,
            suggestion,
            total: productsWithScores.length
        })

    } catch (error) {
        console.error('[SEARCH_ERROR]', error)
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        )
    }
}

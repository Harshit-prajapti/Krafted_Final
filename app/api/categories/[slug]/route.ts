import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const { searchParams } = request.nextUrl
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '12')
        const skip = (page - 1) * pageSize

        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                children: {
                    include: {
                        child: {
                            include: {
                                _count: { select: { products: true } }
                            }
                        }
                    }
                }
            }
        })

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }

        const [productRelations, totalProducts] = await Promise.all([
            prisma.productCategory.findMany({
                where: { categoryId: category.id },
                skip,
                take: pageSize,
                include: {
                    product: {
                        include: {
                            images: { take: 1, orderBy: { priority: 'asc' } },
                            categories: { include: { category: true } },
                            reviews: { select: { rating: true } }
                        }
                    }
                }
            }),
            prisma.productCategory.count({ where: { categoryId: category.id } })
        ])

        const products = productRelations.map(rel => {
            const reviews = rel.product.reviews || []
            const averageRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

            const { reviews: _, ...productData } = rel.product
            return {
                ...productData,
                basePrice: productData.basePrice.toString(),
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length
            }
        })

        return NextResponse.json({
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                children: category.children
            },
            products,
            total: totalProducts,
            page,
            pageSize,
            totalPages: Math.ceil(totalProducts / pageSize)
        })
    } catch (error) {
        console.error('[CATEGORY_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
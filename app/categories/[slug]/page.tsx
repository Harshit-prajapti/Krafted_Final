import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CategoryProductsClient from "@/components/categories/CategoryProductsClient"

export const revalidate = 60 // ISR: revalidate every 60 seconds

interface Props {
    params: Promise<{
        slug: string
    }>
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params

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
        notFound()
    }

    const productRelations = await prisma.productCategory.findMany({
        where: { categoryId: category.id },
        take: 12,
        include: {
            product: {
                include: {
                    images: { take: 1, orderBy: { priority: 'asc' } },
                    categories: { include: { category: true } },
                    reviews: { select: { rating: true } }
                }
            }
        }
    })

    const totalProducts = await prisma.productCategory.count({
        where: { categoryId: category.id }
    })

    const products = productRelations.map((rel: typeof productRelations[number]) => {
        const reviews = rel.product.reviews || []
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
            : 0

        const { reviews: _, ...productData } = rel.product
        return {
            ...productData,
            basePrice: productData.basePrice.toString(),
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length
        }
    })

    return (
        <div className="min-h-screen bg-background pt-24">
            <CategoryProductsClient
                slug={slug}
                categoryName={category.name}
                subcategories={category.children as any}
                initialProducts={products as any}
                initialTotal={totalProducts}
            />
        </div>
    )
}

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CategoryProductsClient from "@/components/categories/CategoryProductsClient"
import { getImmediateChildCategorySummaries, getProductsForCategoryBranch } from "@/lib/category-queries"

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
            children: true,
        }
    })

    if (!category) {
        notFound()
    }

    const [{ products, total }, subcategories] = await Promise.all([
        getProductsForCategoryBranch({ categoryId: category.id, page: 1, pageSize: 12 }),
        getImmediateChildCategorySummaries(category.id),
    ])

    return (
        <div className="min-h-screen bg-background pt-24">
            <CategoryProductsClient
                slug={slug}
                categoryName={category.name}
                subcategories={subcategories as any}
                initialProducts={products as any}
                initialTotal={total}
            />
        </div>
    )
}

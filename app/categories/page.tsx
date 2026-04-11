import { prisma } from '@/lib/prisma'
import CategoriesClient from '@/components/categories/CategoriesClient'
import PageHeader from '@/components/ui/PageHeader'
import { getCategoryBranchSummary } from '@/lib/category-queries'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    let categories = await prisma.category.findMany({
        where: {
            isActive: true,
            parents: { none: {} }
        },
        include: {
            _count: {
                select: { products: true, children: true }
            },
        },
        orderBy: { name: 'asc' }
    })

    if (categories.length === 0) {
        categories = await prisma.category.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { products: true, children: true }
                },
            },
            orderBy: { name: 'asc' }
        })
    }

    const categoriesWithCover = await Promise.all(
        categories.map(async (cat) => {
            const summary = await getCategoryBranchSummary(cat.id)

            return {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                _count: {
                    products: summary.total,
                    children: cat._count.children,
                },
                coverImage: summary.coverImage,
            }
        })
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-16">
            <PageHeader
                badge="Browse"
                title="Explore Collections"
                subtitle="Browse our curated categories to find the perfect piece for your space"
                variant="light"
            />
            <div className="container mx-auto px-4">
                <CategoriesClient initialCategories={categoriesWithCover as any} />

                {categories.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

import { prisma } from '@/lib/prisma'
import CategoriesClient from '@/components/categories/CategoriesClient'
import PageHeader from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        where: {
            isActive: true,
            parents: { none: {} }
        },
        include: {
            _count: {
                select: { products: true, children: true }
            },
            products: {
                take: 1,
                include: {
                    product: {
                        include: {
                            images: {
                                take: 1,
                                orderBy: { priority: 'asc' }
                            }
                        }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    })

    const categoriesWithCover = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        _count: cat._count,
        coverImage: cat.products[0]?.product?.images[0]?.imageUrl || null
    }))

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

import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function AddProductPage() {
    // Fetch data for form selectors
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    })

    const colors = await prisma.color.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500">Create a new product in your catalog.</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <ProductForm categories={categories} colors={colors} />
            </div>
        </div>
    )
}

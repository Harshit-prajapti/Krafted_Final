import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import { serialize } from '@/lib/serialize'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch product with all relations needed for the form
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            categories: true,
            images: { orderBy: { priority: 'asc' } }
        }
    })

    if (!product) {
        notFound()
    }

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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-500">Modify details for {product.name}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <ProductForm
                    categories={categories}
                    colors={colors}
                    initialData={serialize(product)}
                />
            </div>
        </div>
    )
}

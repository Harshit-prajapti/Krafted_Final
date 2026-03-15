import { prisma } from '@/lib/prisma'
import CategoryForm from '@/components/admin/CategoryForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AddCategoryPage() {
    // Fetch categories for parent selection
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            type: true
        },
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/categories"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
                    <p className="text-gray-500">Create a new category for your products.</p>
                </div>
            </div>

            <CategoryForm categories={categories} />
        </div>
    )
}

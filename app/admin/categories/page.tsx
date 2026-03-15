import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FolderTree, Plus, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { products: true }
            },
            parents: {
                include: {
                    parent: true
                }
            },
            children: {
                include: {
                    child: true
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">Manage your product categories and hierarchy.</p>
                </div>
                {/* 
                  For now, we link to a placeholder add page or just a button that doesn't do anything yet 
                  since the requirement was "Category Management (CRUD)" but we want to focus on the UI/Flow first.
                  I'll add a simple client component for adding if needed, but for now just the list.
                */}
                <Link
                    href="/admin/categories/add"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Tag className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">{category.type}</span>
                                </div>
                            </div>
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {category._count.products} Products
                            </span>
                        </div>

                        {(category.parents.length > 0 || category.children.length > 0) && (
                            <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                                {category.parents.length > 0 && (
                                    <div className="mb-2">
                                        <span className="text-gray-500 block text-xs mb-1">Parents:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {category.parents.map(p => (
                                                <span key={p.parentId} className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 text-xs">
                                                    {p.parent.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {category.children.length > 0 && (
                                    <div>
                                        <span className="text-gray-500 block text-xs mb-1">Children:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {category.children.map(c => (
                                                <span key={c.childId} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                                    {c.child.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

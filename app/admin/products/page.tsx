import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminProductsPage({ searchParams }: Props) {
    const page = Number(searchParams?.page) || 1
    const pageSize = 20
    const skip = (page - 1) * pageSize

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                categories: { include: { category: true } },
                images: { take: 1, orderBy: { priority: 'asc' } },
                vendor: true
            },
            skip,
            take: pageSize
        }),
        prisma.product.count()
    ])

    const totalPages = Math.ceil(totalCount / pageSize)
    const startRange = skip + 1
    const endRange = Math.min(skip + pageSize, totalCount)

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your product catalog and inventory</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
                        <Filter size={16} /> Filter
                    </button>
                    <Link
                        href="/admin/products/add"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Search products by name, SKU or category..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm outline-none"
                />
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No products found. Start by adding a new one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 shrink-0 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                    {product.images[0]?.imageUrl ? (
                                                        <img
                                                            src={product.images[0].imageUrl}
                                                            alt={product.name}
                                                            // fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                            <PackageIcon />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5 max-w-[150px] truncate">{product.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">₹{Number(product.basePrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                {product.categories.slice(0, 2).map((pc) => (
                                                    <span key={pc.categoryId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        {pc.category.name}
                                                    </span>
                                                ))}
                                                {product.categories.length > 2 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        +{product.categories.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border ${product.isActive
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    target="_blank"
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Live"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-900">{startRange}</span> to <span className="font-medium text-gray-900">{endRange}</span> of <span className="font-medium text-gray-900">{totalCount}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/products?page=${Math.max(1, page - 1)}`}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 transition-colors ${page <= 1
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed pointer-events-none'
                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </Link>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Only show current page, first, last, and pages around current
                                if (
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    (pageNum >= page - 1 && pageNum <= page + 1)
                                ) {
                                    return (
                                        <Link
                                            key={pageNum}
                                            href={`/admin/products?page=${pageNum}`}
                                            className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${page === pageNum
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                } else if (
                                    (pageNum === 2 && page > 3) ||
                                    (pageNum === totalPages - 1 && page < totalPages - 2)
                                ) {
                                    return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <Link
                            href={`/admin/products?page=${Math.min(totalPages, page + 1)}`}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 transition-colors ${page >= totalPages
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed pointer-events-none'
                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            Next
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

function PackageIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
        >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22v-10" />
        </svg>
    )
}

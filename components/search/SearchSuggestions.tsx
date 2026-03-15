'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    slug: string
    images: Array<{ imageUrl: string }>
}

interface Category {
    id: string
    name: string
    slug: string
    _count?: { products: number }
}

interface SearchSuggestionsProps {
    products: Product[]
    categories: Category[]
    loading: boolean
    query: string
    onClose: () => void
}

export default function SearchSuggestions({
    products,
    categories,
    loading,
    query,
    onClose
}: SearchSuggestionsProps) {
    const highlightMatch = (text: string) => {
        if (!query) return text

        const parts = text.split(new RegExp(`(${query})`, 'gi'))
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={i} className="bg-amber-200 font-semibold">{part}</mark>
            ) : (
                <span key={i}>{part}</span>
            )
        )
    }

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute mt-4 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-20"
            >
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Searching...</span>
                </div>
            </motion.div>
        )
    }

    if (products.length === 0 && categories.length === 0 && query.length >= 2) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute mt-4 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-20"
            >
                <div className="px-6 py-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No matching products or categories found</p>
                    <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute mt-4 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-20 max-h-[500px] overflow-y-auto"
        >
            {/* Categories Section */}
            {categories.length > 0 && (
                <div className="border-b border-gray-100">
                    <div className="px-6 py-3 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Categories
                        </p>
                    </div>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?categoryId=${category.id}`}
                            onClick={onClose}
                            className="w-full px-6 py-3.5 hover:bg-amber-50 flex justify-between items-center border-b border-gray-50 last:border-0 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Package className="w-4 h-4 text-amber-700" />
                                </div>
                                <span className="font-medium text-gray-800 group-hover:text-amber-700 transition-colors">
                                    {highlightMatch(category.name)}
                                </span>
                            </div>
                            {category._count && (
                                <span className="text-xs text-gray-400">
                                    {category._count.products} items
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}

            {/* Products Section */}
            {products.length > 0 && (
                <div>
                    {categories.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Search className="w-3 h-3" />
                                Products
                            </p>
                        </div>
                    )}
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={onClose}
                            className="w-full px-6 py-3.5 hover:bg-amber-50 flex items-center gap-4 border-b border-gray-50 last:border-0 transition-colors group"
                        >
                            {product.images[0] && (
                                <img
                                    src={product.images[0].imageUrl}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 group-hover:border-amber-300 transition-colors"
                                />
                            )}
                            <div className="flex-1">
                                <span className="font-medium text-gray-800 group-hover:text-amber-700 transition-colors block">
                                    {highlightMatch(product.name)}
                                </span>
                                <span className="text-xs text-gray-400">Product</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

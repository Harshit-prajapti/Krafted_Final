'use client'

import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, ChevronDown, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FilterSidebar from '@/components/shop/FilterSidebar'
import ProductGrid from '@/components/shop/ProductGrid'
import FilterBadges from '@/components/shop/FilterBadges'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

interface Product {
    id: string
    name: string
    slug: string
    basePrice: string
    images: Array<{ imageUrl: string; altText?: string | null }>
    categories: Array<{ category: { name: string; id: string } }>
    averageRating?: number
    totalReviews?: number
}

interface ShopClientProps {
    initialProducts: Product[]
    initialTotal: number
    filters: any
}

export default function ShopClient({ initialProducts, initialTotal, filters }: ShopClientProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Parse active filters from URL
    const [activeFilters, setActiveFilters] = useState<{
        categories: Array<{ id: string; name: string }>
        colors: Array<{ id: string; name: string }>
        materials: string[]
        priceRange?: { min: string; max: string }
    }>({
        categories: [],
        colors: [],
        materials: [],
    })

    // Fetch filter metadata (category names, color names)
    useEffect(() => {
        const categoryIds = searchParams.getAll('categoryId')
        const colorIds = searchParams.getAll('colorId')
        const materials = searchParams.getAll('material')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')

        // Fetch category names
        if (categoryIds.length > 0) {
            fetch('/api/categories?isActive=true')
                .then(res => res.json())
                .then(data => {
                    const selectedCats = (data || []).filter((cat: any) =>
                        categoryIds.includes(cat.id)
                    )
                    setActiveFilters(prev => ({ ...prev, categories: selectedCats }))
                })
        } else {
            setActiveFilters(prev => ({ ...prev, categories: [] }))
        }

        // Fetch color names
        if (colorIds.length > 0) {
            fetch('/api/colors')
                .then(res => res.json())
                .then(data => {
                    const selectedColors = (data || []).filter((color: any) =>
                        colorIds.includes(color.id)
                    )
                    setActiveFilters(prev => ({ ...prev, colors: selectedColors }))
                })
        } else {
            setActiveFilters(prev => ({ ...prev, colors: [] }))
        }

        setActiveFilters(prev => ({
            ...prev,
            materials: materials,
            priceRange: minPrice || maxPrice ? { min: minPrice || '', max: maxPrice || '' } : undefined
        }))
    }, [searchParams])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['products', searchParams.toString(), sortBy, sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams(searchParams)
            params.set('page', pageParam.toString())
            params.set('pageSize', '12')
            params.set('sortBy', sortBy)
            params.set('sortOrder', sortOrder)

            const res = await fetch(`/api/products?${params}`)
            if (!res.ok) throw new Error('Failed to fetch products')
            const data = await res.json()
            return { data: data.data || [], total: data.total || 0 }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length + 1
            const totalPages = Math.ceil(lastPage.total / 12)
            return nextPage <= totalPages ? nextPage : undefined
        },
        initialData: {
            pages: [{ data: initialProducts, total: initialTotal }],
            pageParams: [1],
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    const allProducts = data?.pages.flatMap(page => page.data) || []
    const totalProducts = data?.pages[0]?.total || 0

    const handleRemoveFilter = (type: string, value: string) => {
        const params = new URLSearchParams(searchParams)

        if (type === 'category') {
            const categories = params.getAll('categoryId').filter(id => id !== value)
            params.delete('categoryId')
            categories.forEach(id => params.append('categoryId', id))
        } else if (type === 'color') {
            const colors = params.getAll('colorId').filter(id => id !== value)
            params.delete('colorId')
            colors.forEach(id => params.append('colorId', id))
        } else if (type === 'material') {
            const materials = params.getAll('material').filter(m => m !== value)
            params.delete('material')
            materials.forEach(m => params.append('material', m))
        }

        router.push(`/shop?${params.toString()}`)
    }

    const handleClearPriceRange = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('minPrice')
        params.delete('maxPrice')
        router.push(`/shop?${params.toString()}`)
    }

    const handleClearAll = () => {
        router.push('/shop')
    }

    return (
        <>
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center md:text-left">
                    <motion.div
                        className="flex justify-center md:justify-start items-center gap-2 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="uppercase tracking-[0.2em] text-xs font-semibold text-amber-600">Shop</span>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-gray-900">
                        Shop Collection
                    </h1>
                    <p className="text-gray-600 font-light tracking-wide">
                        Discover {totalProducts} curated pieces for your home
                    </p>
                </div>

                <div className="flex gap-3 mt-6 md:mt-0">
                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-300 hover:border-gold hover:text-gold"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter size={16} /> Filters
                        </Button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [newSortBy, newSortOrder] = e.target.value.split('-')
                                setSortBy(newSortBy)
                                setSortOrder(newSortOrder)
                            }}
                            className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-md bg-white hover:border-gold transition-colors cursor-pointer text-sm font-medium"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" size={16} />
                    </div>
                </div>
            </motion.div>

            {/* Mobile Filter Overlay */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white p-6 overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-xl font-heading font-semibold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <FilterSidebar />
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters - Desktop */}
                <FilterSidebar className="hidden lg:block shrink-0" />

                {/* Product Grid */}
                <div className="flex-1">
                    {/* Active Filter Badges */}
                    <FilterBadges
                        filters={activeFilters}
                        onRemoveCategory={(id) => handleRemoveFilter('category', id)}
                        onRemoveColor={(id) => handleRemoveFilter('color', id)}
                        onRemoveMaterial={(mat) => handleRemoveFilter('material', mat)}
                        onClearPriceRange={handleClearPriceRange}
                        onClearAll={handleClearAll}
                    />

                    {isLoading ? (
                        <LoadingSkeleton count={12} />
                    ) : (
                        <>
                            <ProductGrid products={allProducts} loading={false} />

                            {/* Load More */}
                            {!isLoading && hasNextPage && (
                                <div className="mt-12 flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="min-w-[200px] border-gray-300 hover:border-gold hover:bg-gold hover:text-white transition-all"
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                    >
                                        {isFetchingNextPage ? 'Loading...' : 'Load More Products'}
                                    </Button>
                                </div>
                            )}

                            {!isLoading && allProducts.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Filter className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 text-lg mb-4">No products found matching your criteria.</p>
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 hover:border-gold hover:text-gold"
                                        onClick={handleClearAll}
                                    >
                                        Clear All Filters
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

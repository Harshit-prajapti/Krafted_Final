'use client'

import { useState, useEffect, Suspense } from 'react'
import ProductCard from "@/components/product/ProductCard"
import { Search, Sparkles, ChevronDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import FilterSidebar from '@/components/shop/FilterSidebar'
import FilterBadges from '@/components/shop/FilterBadges'

function SearchResultsContent() {
    const router = useRouter()
    const params = useSearchParams()
    const query = params.get('q') || ""

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('relevance')
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Parse active filters
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

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                // Build query params
                const urlParams = new URLSearchParams(params.toString())
                urlParams.set('q', query)
                urlParams.set('limit', '24')
                urlParams.set('includeCategories', 'false')

                const res = await fetch(`/api/products/search?${urlParams}`)
                if (res.ok) {
                    const data = await res.json()
                    let fetchedProducts = data.products || []

                    // Apply sorting
                    if (sortBy === 'price-asc') {
                        fetchedProducts.sort((a: any, b: any) => parseFloat(a.basePrice) - parseFloat(b.basePrice))
                    } else if (sortBy === 'price-desc') {
                        fetchedProducts.sort((a: any, b: any) => parseFloat(b.basePrice) - parseFloat(a.basePrice))
                    } else if (sortBy === 'name') {
                        fetchedProducts.sort((a: any, b: any) => a.name.localeCompare(b.name))
                    }
                    // relevance is default from API

                    setProducts(fetchedProducts)
                }
            } catch (error) {
                console.error("Error fetching search results:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query, params, sortBy])

    // Fetch filter metadata
    useEffect(() => {
        const categoryIds = params.getAll('categoryId')
        const colorIds = params.getAll('colorId')
        const materials = params.getAll('material')
        const minPrice = params.get('minPrice')
        const maxPrice = params.get('maxPrice')

        if (categoryIds.length > 0) {
            fetch('/api/categories?isActive=true')
                .then(res => res.json())
                .then(data => {
                    const selectedCats = (data || []).filter((cat: any) => categoryIds.includes(cat.id))
                    setActiveFilters(prev => ({ ...prev, categories: selectedCats }))
                })
        } else {
            setActiveFilters(prev => ({ ...prev, categories: [] }))
        }

        if (colorIds.length > 0) {
            fetch('/api/colors')
                .then(res => res.json())
                .then(data => {
                    const selectedColors = (data || []).filter((color: any) => colorIds.includes(color.id))
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
    }, [params])

    const handleRemoveFilter = (type: string, value: string) => {
        const urlParams = new URLSearchParams(params)

        if (type === 'category') {
            const categories = urlParams.getAll('categoryId').filter(id => id !== value)
            urlParams.delete('categoryId')
            categories.forEach(id => urlParams.append('categoryId', id))
        } else if (type === 'color') {
            const colors = urlParams.getAll('colorId').filter(id => id !== value)
            urlParams.delete('colorId')
            colors.forEach(id => urlParams.append('colorId', id))
        } else if (type === 'material') {
            const materials = urlParams.getAll('material').filter(m => m !== value)
            urlParams.delete('material')
            materials.forEach(m => urlParams.append('material', m))
        }

        router.push(`/search/results?${urlParams.toString()}`)
    }

    const handleClearPriceRange = () => {
        const urlParams = new URLSearchParams(params)
        urlParams.delete('minPrice')
        urlParams.delete('maxPrice')
        router.push(`/search/results?${urlParams.toString()}`)
    }

    const handleClearAllFilters = () => {
        router.push(`/search/results?q=${encodeURIComponent(query)}`)
    }

    if (!query) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-gray-50 pt-32">
                <Search className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Please enter a search term</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-sm text-amber-600 font-medium tracking-wide uppercase mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Search Results
                            </p>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                                "{query}"
                                <span className="text-gray-400 font-normal ml-3 text-2xl">
                                    ({products.length} {products.length === 1 ? 'result' : 'results'})
                                </span>
                            </h1>
                        </div>

                        <div className="flex gap-3">
                            {/* Mobile Filter Button */}
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
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-md bg-white hover:border-gold transition-colors cursor-pointer text-sm font-medium"
                                >
                                    <option value="relevance">Most Relevant</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

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

                    {/* Results */}
                    <div className="flex-1">
                        {/* Active Filter Badges */}
                        <FilterBadges
                            filters={activeFilters}
                            onRemoveCategory={(id) => handleRemoveFilter('category', id)}
                            onRemoveColor={(id) => handleRemoveFilter('color', id)}
                            onRemoveMaterial={(mat) => handleRemoveFilter('material', mat)}
                            onClearPriceRange={handleClearPriceRange}
                            onClearAll={handleClearAllFilters}
                        />

                        {loading ? (
                            <LoadingSkeleton count={12} />
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Search className="w-10 h-10 text-gray-300" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">No matches found for "{query}"</h2>
                                <p className="text-gray-500 max-w-md text-center mb-6">
                                    Try checking your spelling or using more general terms like "sofa" or "table".
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/search')}
                                    className="border-gray-300 hover:border-gold hover:text-gold"
                                >
                                    Back to Search
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={Number(product.basePrice)}
                                        image={product.images[0]?.imageUrl || '/placeholder.png'}
                                        category={product.categories[0]?.category?.name || 'Furniture'}
                                        slug={product.slug}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4"><LoadingSkeleton count={12} /></div>}>
            <SearchResultsContent />
        </Suspense>
    )
}

'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductGrid from '@/components/shop/ProductGrid'
import { useRef, useEffect } from 'react'

interface Product {
    id: string
    name: string
    slug: string
    basePrice: string
    images: Array<{ imageUrl: string; altText?: string | null }>
    categories: Array<{ category: { name: string } }>
    averageRating?: number
    totalReviews?: number
}

interface Subcategory {
    child: {
        id: string
        name: string
        slug: string
        _count: { products: number }
    }
}

interface CategoryProductsClientProps {
    slug: string
    categoryName: string
    subcategories: Subcategory[]
    initialProducts: Product[]
    initialTotal: number
}

export default function CategoryProductsClient({
    slug,
    categoryName,
    subcategories,
    initialProducts,
    initialTotal
}: CategoryProductsClientProps) {
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['category-products', slug],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetch(`/api/categories/${slug}?page=${pageParam}&pageSize=12`)
            if (!res.ok) throw new Error('Failed to fetch products')
            const data = await res.json()
            return {
                products: data.products || [],
                total: data.total || 0
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length + 1
            const totalPages = Math.ceil(lastPage.total / 12)
            return nextPage <= totalPages ? nextPage : undefined
        },
        initialData: {
            pages: [{ products: initialProducts, total: initialTotal }],
            pageParams: [1],
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    const allProducts = data?.pages.flatMap(page => page.products) || []
    const totalProducts = data?.pages[0]?.total || 0

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 0.1 }
        )

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <>
            <div className="bg-secondary/5 py-12 mb-2">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/categories" className="hover:text-gold transition-colors">Categories</Link>
                        <ChevronRight size={14} />
                        <span className="text-foreground font-medium capitalize">{categoryName}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-medium mt-4 capitalize">
                        {categoryName}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20">
                {subcategories.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-heading font-medium mb-8 border-b border-border pb-4">
                            Collections
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {subcategories.map(({ child }) => (
                                <Link
                                    key={child.id}
                                    href={`/categories/${child.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-all h-full flex flex-col items-center text-center justify-center min-h-[120px]">
                                        <h3 className="text-lg font-bold mb-1 group-hover:text-gold transition-colors">
                                            {child.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {child._count.products} Products
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-20">
                    <h2 className="text-2xl font-heading font-medium mb-8 border-b border-border pb-4">
                        {categoryName} Products
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-muted h-80 rounded-lg mb-4" />
                                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : allProducts.length > 0 ? (
                        <>
                            <ProductGrid products={allProducts} />

                            <div ref={loadMoreRef} className="mt-12 flex justify-center">
                                {isFetchingNextPage ? (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Loading more products...</span>
                                    </div>
                                ) : hasNextPage ? (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="min-w-[200px] border-gray-300 hover:border-gold hover:bg-gold hover:text-white transition-all"
                                        onClick={() => fetchNextPage()}
                                    >
                                        Load More Products
                                    </Button>
                                ) : allProducts.length > 12 ? (
                                    <p className="text-muted-foreground text-sm">
                                        You've seen all {totalProducts} products
                                    </p>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-secondary/5 rounded-lg">
                            <p className="text-muted-foreground">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

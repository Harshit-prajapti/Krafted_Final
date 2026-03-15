"use client"
import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'

interface RelatedProduct {
    id: string
    name: string
    slug: string
    basePrice: string
    images: Array<{ imageUrl: string; altText: string | null }>
    categories: Array<{ category: { name: string } }>
}

interface RelatedProductsProps {
    currentProductId?: string
    categoryIds?: string[]
}

export default function RelatedProducts({ currentProductId, categoryIds }: RelatedProductsProps) {
    const [products, setProducts] = useState<RelatedProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const sliderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!categoryIds || categoryIds.length === 0) {
                setLoading(false)
                return
            }

            try {
                const params = new URLSearchParams()
                categoryIds.forEach(id => params.append('categoryId', id))
                if (currentProductId) {
                    params.append('excludeId', currentProductId)
                }
                params.append('limit', '8')

                const response = await fetch(`/api/products/related?${params.toString()}`)
                if (response.ok) {
                    const data = await response.json()
                    setProducts(data.products || [])
                }
            } catch (error) {
                console.error('Error fetching related products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRelatedProducts()
    }, [categoryIds, currentProductId])

    const itemsPerView = 4
    const maxIndex = Math.max(0, products.length - itemsPerView)

    const handlePrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
    }

    if (loading) {
        return (
            <section className="pt-20 border-t border-border">
                <h2 className="text-3xl font-heading font-bold mb-10 text-center">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 aspect-square rounded-xl mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <section className="pt-20 border-t border-border">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-heading font-bold">You May Also Like</h2>

                {products.length > itemsPerView && (
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= maxIndex}
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-hidden" ref={sliderRef}>
                <motion.div
                    className="flex gap-6"
                    animate={{ x: `-${currentIndex * (100 / itemsPerView + 1.5)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                price={parseFloat(product.basePrice)}
                                image={product.images[0]?.imageUrl || '/images/placeholder.jpg'}
                                category={product.categories[0]?.category.name || 'Furniture'}
                                slug={product.slug}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>

            {products.length > itemsPerView && (
                <div className="flex justify-center gap-2 mt-6">
                    {[...Array(maxIndex + 1)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                                    ? 'bg-amber-500 w-6'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

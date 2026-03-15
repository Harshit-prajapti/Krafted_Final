"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'

interface Product {
    id: string
    name: string
    slug: string
    basePrice: string | number
    images: Array<{ imageUrl: string; altText?: string | null }>
    categories: Array<{ category: { name: string } }>
}

interface ProductCarouselProps {
    products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Calculate how many slides (pages) we have. 
    // Since we show 1 item fully + maybe partial, let's just make it 1 dot per item for simplicity 
    // OR 1 dot per group. The user said "slider for three products", likely meaning swipe through them.
    // Let's assume standard carousel behavior: scrolling container with dots representing items.

    return (
        <div className="w-full">
            {/* Scrollable Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-2 no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft
                    const width = e.currentTarget.offsetWidth
                    const index = Math.round(scrollLeft / (width * 0.8)) // Approx index
                    setCurrentIndex(Math.min(index, products.length - 1))
                }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[85%] snap-center first:pl-2 last:pr-2">
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            price={Number(product.basePrice)}
                            image={product.images[0]?.imageUrl || '/placeholder.jpg'}
                            category={product.categories[0]?.category.name || 'Furniture'}
                        />
                    </div>
                ))}
            </div>

            {/* Dots Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                {products.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-gold w-4' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

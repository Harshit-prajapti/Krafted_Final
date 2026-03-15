"use client"
import React from 'react'
import ProductCard from '@/components/product/ProductCard'
import { motion } from 'framer-motion'

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

interface ProductGridProps {
    products: Product[]
    loading?: boolean
    className?: string
}

export default function ProductGrid({ products, loading = false, className }: ProductGridProps) {
    if (loading) {
        return (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 ${className}`}>
                {[...Array(12)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-muted h-80 rounded-lg mb-4"></div>
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 ${className}`}>
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                >
                    <ProductCard
                        id={product.id}
                        name={product.name}
                        slug={product.slug}
                        price={parseFloat(product.basePrice)}
                        image={product.images[0]?.imageUrl || '/placeholder.jpg'}
                        category={product.categories[0]?.category.name || 'Furniture'}
                    />
                </motion.div>
            ))}
        </div>
    )
}

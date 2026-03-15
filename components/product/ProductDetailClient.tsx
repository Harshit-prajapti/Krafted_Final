'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductInfo from '@/components/product/ProductInfo'
import { ProductBreadcrumb } from '@/components/product/ProductBreadcrumb'
import RelatedProducts from '@/components/product/RelatedProducts'
import Link from 'next/link'

interface ProductImage {
    id: string
    imageUrl: string
    altText: string | null
    priority: number
    isPrimary: boolean
}

interface ProductVariant {
    id: string
    sku: string
    price: string | null
    size: string | null
    material: string | null
    isActive: boolean
    color: {
        id: string
        name: string
        hexCode: string | null
    } | null
}

interface Category {
    id: string
    name: string
    slug: string
    type: string
}

interface Product {
    id: string
    name: string
    slug: string
    description: string
    basePrice: string
    material: string | null
    dimensions: string | null
    weight: string | null
    isActive: boolean
    images: ProductImage[]
    variants: ProductVariant[]
    categories: Array<{ category: Category }>
    averageRating: number
    totalReviews: number
}

interface ProductDetailClientProps {
    product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    return (
        <div className="min-h-screen bg-background relative">
            <div className="container mx-auto px-4 py-8 pt-28 md:pt-32">
                <Link href="/search">Search</Link>
                {/* Breadcrumb */}
                <ProductBreadcrumb
                    categories={product.categories}
                    productName={product.name}
                />

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8 max-w-6xl mx-auto">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ProductImageGallery
                            images={product.images.map(img => ({
                                ...img,
                                altText: img.altText || product.name
                            }))}
                            productName={product.name}
                        />
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:py-4"
                    >
                        <ProductInfo
                            name={product.name}
                            price={product.basePrice}
                            description={product.description}
                            productId={product.id}
                            colors={product.variants
                                .filter((v): v is ProductVariant & { color: NonNullable<ProductVariant['color']> } => v.color !== null)
                                .map(v => ({
                                    color: {
                                        ...v.color,
                                        hexCode: v.color.hexCode || '#000000'
                                    }
                                }))
                                // Deduplicate by color ID
                                .filter((v, i, self) => i === self.findIndex(t => t.color.id === v.color.id))
                            }
                        />
                    </motion.div>
                </div>

                {/* Product Description */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-heading font-bold mb-4 luxury-product-name">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                    {product.material && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Material</h3>
                            <p className="text-muted-foreground">{product.material}</p>
                        </div>
                    )}

                    {product.dimensions && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Dimensions</h3>
                            <p className="text-muted-foreground">{product.dimensions}</p>
                        </div>
                    )}
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h2 className="text-2xl font-heading font-bold mb-6 luxury-product-name">Customer Reviews</h2>
                    {product.totalReviews > 0 ? (
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-bold">{product.averageRating.toFixed(1)}</span>
                                <div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < Math.round(product.averageRating) ? 'text-gold text-lg' : 'text-gray-300 text-lg'}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{product.totalReviews} reviews</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    )}
                </motion.div>

                {/* Related Products */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <RelatedProducts
                        currentProductId={product.id}
                        categoryIds={product.categories.map(c => c.category.id)}
                    />
                </motion.div>
            </div>
        </div>
    )
}

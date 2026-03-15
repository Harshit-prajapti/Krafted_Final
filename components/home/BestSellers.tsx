"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/components/product/ProductCard'
import ProductCarousel from '@/components/home/ProductCarousel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LuxuryProductView from '@/components/home/LuxuryProductView'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Product {
    id: string
    name: string
    slug: string
    basePrice: string
    images: Array<{ imageUrl: string; altText?: string | null }>
    categories: Array<{ category: { name: string } }>
}

export default function BestSellers() {
    const { t } = useTranslation(['home', 'common'])
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products', 'best-sellers'],
        queryFn: async () => {
            const res = await fetch('/api/products?limit=12&sortBy=createdAt&sortOrder=desc')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            return data.data || []
        },
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    const luxury1 = products[0]
    const luxury2 = products[1]
    const slider1 = products.slice(2, 5)
    const luxury3 = products[5]
    const luxury4 = products[6]
    const slider2 = products.slice(7, 10)
    const remaining = products.slice(10, 12)

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">{t('sections.trendingNow', 'Trending Now')}</h2>
                        <p className="text-muted-foreground max-w-md">
                            {t('sections.trendingNowDesc', "Discover what's popular this season with our trending furniture collection.")}
                        </p>
                    </div>
                    <Link href="/shop" className="hidden md:block">
                        <Button variant="outline">{t('common:buttons.viewAll', 'View All')}</Button>
                    </Link>
                </div>

                {/* Mobile Layout: Luxury(1) -> Luxury(1) -> Slider -> Repeat */}
                <div className="block md:hidden space-y-8">
                    {/* First Luxury Block */}
                    <div className="space-y-4">
                        {luxury1 && (
                            <LuxuryProductView
                                id={luxury1.id}
                                name={luxury1.name}
                                price={parseFloat(luxury1.basePrice)}
                                image={luxury1.images[0]?.imageUrl || '/placeholder.jpg'}
                                category={luxury1.categories[0]?.category.name || 'Furniture'}
                                slug={luxury1.slug}
                            />
                        )}
                        {luxury2 && (
                            <LuxuryProductView
                                id={luxury2.id}
                                name={luxury2.name}
                                price={parseFloat(luxury2.basePrice)}
                                image={luxury2.images[0]?.imageUrl || '/placeholder.jpg'}
                                category={luxury2.categories[0]?.category.name || 'Furniture'}
                                slug={luxury2.slug}
                            />
                        )}
                    </div>

                    {/* First Slider */}
                    {slider1.length > 0 && (
                        <div className="py-4">
                            <ProductCarousel products={slider1} />
                        </div>
                    )}

                    {/* Second Luxury Block */}
                    <div className="space-y-4">
                        {luxury3 && (
                            <LuxuryProductView
                                id={luxury3.id}
                                name={luxury3.name}
                                price={parseFloat(luxury3.basePrice)}
                                image={luxury3.images[0]?.imageUrl || '/placeholder.jpg'}
                                category={luxury3.categories[0]?.category.name || 'Furniture'}
                                slug={luxury3.slug}
                            />
                        )}
                        {luxury4 && (
                            <LuxuryProductView
                                id={luxury4.id}
                                name={luxury4.name}
                                price={parseFloat(luxury4.basePrice)}
                                image={luxury4.images[0]?.imageUrl || '/placeholder.jpg'}
                                category={luxury4.categories[0]?.category.name || 'Furniture'}
                                slug={luxury4.slug}
                            />
                        )}
                    </div>

                    {/* Second Slider */}
                    {slider2.length > 0 && (
                        <div className="py-4">
                            <ProductCarousel products={slider2} />
                        </div>
                    )}

                    {/* Remaining in Grid */}
                    {remaining.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {remaining.map((product: Product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    slug={product.slug}
                                    price={parseFloat(product.basePrice)}
                                    image={product.images[0]?.imageUrl || '/placeholder.jpg'}
                                    category={product.categories[0]?.category.name || 'Furniture'}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 12).map((product: Product, index: number) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
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

                <div className="mt-12 text-center md:hidden">
                    <Link href="/shop">
                        <Button variant="outline">{t('common:buttons.viewAll', 'View All')}</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

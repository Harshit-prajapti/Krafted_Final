"use client"
import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'
import ProductCarousel from '@/components/home/ProductCarousel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAddToCart } from '@/lib/hooks/useAddToCart'
import { Loader2, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BEST_SELLERS = [
    {
        id: '1',
        name: 'Royal Velvet Throne Sofa',
        price: 5200,
        image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1000&auto=format&fit=crop',
        category: 'Living Room',
        slug: 'royal-throne-sofa'
    },
    {
        id: '2',
        name: 'Victorian Gold Trim Sofa',
        price: 4800,
        image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1000&auto=format&fit=crop',
        category: 'Living Room',
        slug: 'victorian-gold-sofa'
    },
    {
        id: '3',
        name: 'Imperial Mahogany Dining Table',
        price: 6200,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
        category: 'Dining',
        slug: 'imperial-mahogany-table'
    },
    {
        id: '4',
        name: 'Baroque Carved Dining Chair',
        price: 1350,
        image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1000&auto=format&fit=crop',
        category: 'Dining',
        slug: 'baroque-dining-chair'
    },
    {
        id: '5',
        name: 'Regal Tufted Wingback Chair',
        price: 1750,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
        category: 'Armchairs',
        slug: 'regal-wingback-chair'
    },
    {
        id: '6',
        name: 'Classic Leather Chesterfield',
        price: 4100,
        image: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?q=80&w=1000&auto=format&fit=crop',
        category: 'Living Room',
        slug: 'chesterfield-sofa'
    },
    {
        id: '7',
        name: 'Royal Canopy King Bed',
        price: 7500,
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop',
        category: 'Bedroom',
        slug: 'royal-canopy-bed'
    },
    {
        id: '8',
        name: 'Hand-Carved Palace Bed Frame',
        price: 6900,
        image: '/images/available dinning diffrent colour.png',
        category: 'Bedroom',
        slug: 'palace-bed-frame'
    },
    {
        id: '9',
        name: 'Marble Top Royal Coffee Table',
        price: 2100,
        image: 'https://images.pexels.com/photos/3773570/pexels-photo-3773570.png',
        category: 'Living Room',
        slug: 'royal-coffee-table'
    },
    {
        id: '10',
        name: 'Antique Gold Accent Console',
        price: 2950,
        image: 'https://images.pexels.com/photos/6538945/pexels-photo-6538945.jpeg',
        category: 'Decor',
        slug: 'gold-accent-console'
    },
    {
        id: '11',
        name: 'Royal Upholstered Ottoman',
        price: 980,
        image: 'https://images.pexels.com/photos/6969866/pexels-photo-6969866.jpeg',
        category: 'Living Room',
        slug: 'royal-ottoman'
    },
    {
        id: '12',
        name: 'Luxury Palace Side Table',
        price: 1650,
        image: 'https://images.pexels.com/photos/7031737/pexels-photo-7031737.jpeg',
        category: 'Bedroom',
        slug: 'palace-side-table'
    }
];


import LuxuryProductView from '@/components/home/LuxuryProductView'

export default function FeaturedCategories() {
    // Layout Logic:
    // 1. Luxury View (Product 1)
    // 2. Luxury View (Product 2)
    // 3. Slider (Products 3-5)
    // 4. Luxury View (Product 6)
    // 5. Luxury View (Product 7)
    // 6. Slider (Products 8-10)
    // 7. Grid (Remaining)

    const { t } = useTranslation(['home', 'common'])

    // Helper to adapt static data for ProductCarousel
    const adapt = (item: any) => ({
        ...item,
        name: t(`product:names.${item.slug.replace(/-/g, (match: string, offset: number) => {
            // Very basic slug to camelCase for the keys I created
            return offset > 0 ? match.toUpperCase().replace('-', '') : match;
        }).replace(/-([a-z])/g, (g : String) => g[1].toUpperCase())}`, item.name),
        // Wait, the keys I created are: royalThroneSofa, victorianGoldSofa, imperialMahoganyTable, baroqueDiningChair, regalWingbackChair, chesterfieldSofa, royalCanopyBed, palaceBedFrame, royalCoffeeTable, goldAccentConsole, royalOttoman, palaceSideTable
    })

    // Better mapping for the hardcoded ones
    const productKeyMap: Record<string, string> = {
        'royal-throne-sofa': 'royalThroneSofa',
        'victorian-gold-sofa': 'victorianGoldSofa',
        'imperial-mahogany-table': 'imperialMahoganyTable',
        'baroque-dining-chair': 'baroqueDiningChair',
        'regal-wingback-chair': 'regalWingbackChair',
        'chesterfield-sofa': 'chesterfieldSofa',
        'royal-canopy-bed': 'royalCanopyBed',
        'palace-bed-frame': 'palaceBedFrame',
        'royal-coffee-table': 'royalCoffeeTable',
        'gold-accent-console': 'goldAccentConsole',
        'royal-ottoman': 'royalOttoman',
        'palace-side-table': 'palaceSideTable'
    }

    const categoryMap: Record<string, string> = {
        'Living Room': 'categories.livingRoom',
        'Bedroom': 'categories.bedroom',
        'Dining': 'categories.dining',
        'Office': 'categories.office',
        'Outdoor': 'categories.outdoor',
        'Decor': 'categories.decor',
        'Armchairs': 'categories.armchairs'
    }

    const translateProduct = (p: any) => ({
        ...p,
        name: t(`product:names.${productKeyMap[p.slug]}`, p.name),
        category: t(categoryMap[p.category] || p.category, p.category)
    })

    const luxury1 = translateProduct(BEST_SELLERS[0])
    const luxury2 = translateProduct(BEST_SELLERS[1])
    const slider1 = BEST_SELLERS.slice(2, 5).map(translateProduct)
    const luxury3 = translateProduct(BEST_SELLERS[5])
    const luxury4 = translateProduct(BEST_SELLERS[6])
    const slider2 = BEST_SELLERS.slice(7, 10).map(translateProduct)
    const remaining = BEST_SELLERS.slice(10, 12).map(translateProduct)
    // Helper to adapt static data for ProductCarousel
    const adaptForCarousel = (products: typeof BEST_SELLERS) => {
        return products.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            basePrice: p.price,
            images: [{ imageUrl: p.image }],
            categories: [{ category: { name: p.category } }]
        }))
    }

    return (
        <section className="py-16 bg-secondary/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">{t('sections.bestSellers', 'Best Sellers')}</h2>
                        <p className="text-muted-foreground max-w-md">
                            {t('sections.bestSellersDesc', 'Our most coveted pieces, loved for their timeless design and exceptional craftsmanship.')}
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
                        <LuxuryProductView {...luxury1} />
                        <LuxuryProductView {...luxury2} />
                    </div>

                    {/* First Slider */}
                    <div className="py-4">
                        <ProductCarousel products={adaptForCarousel(slider1)} />
                    </div>

                    {/* Second Luxury Block */}
                    <div className="space-y-4">
                        <LuxuryProductView {...luxury3} />
                        <LuxuryProductView {...luxury4} />
                    </div>

                    {/* Second Slider */}
                    <div className="py-4">
                        <ProductCarousel products={adaptForCarousel(slider2)} />
                    </div>

                    {/* Remaining in Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {remaining.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>

                {/* Desktop Layout: 4-column Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {BEST_SELLERS.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ProductCard {...product} />
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
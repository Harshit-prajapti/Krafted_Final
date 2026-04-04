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

const IMAGE_BASE_URL = 'https://pub-6373be2f34c246649e921d2bef6e47c1.r2.dev';

const BEST_SELLERS = [
  {
    id: '1',
    name: 'Baroque Gold Armchair',
    price: 62000,
    image: `${IMAGE_BASE_URL}/ac_baroque_gold.png`,
    category: 'Armchairs',
    slug: 'baroque-gold-armchair'
  },
  { 
    id: '2',
    name: 'Baroque Teal Armchair',
    price: 59500,
    image: `${IMAGE_BASE_URL}/ac_baroque_teal.png`,
    category: 'Armchairs',
    slug: 'baroque-teal-armchair'
  },
  {
    id: '3',
    name: 'Mint White Sofa',
    price: 62000,
    image: `${IMAGE_BASE_URL}/sf_mint_white.png`,
    category: 'Sofas',
    slug: 'mint-white-sofa'
  },
  {
    id: '4',
    name: 'Opulent Baroque Armchair',
    price: 85000,
    image: `${IMAGE_BASE_URL}/Opulent baroque armchair in grand library.png`,
    category: 'Armchairs',
    slug: 'opulent-baroque-armchair'
  },
  {
    id: '5',
    name: 'Ivory Chesterfield Sofa',
    price: 89999,
    image: `${IMAGE_BASE_URL}/sf_ivory_chesterfield.png`,
    category: 'Sofas',
    slug: 'ivory-chesterfield-sofa'
  },
  {
    id: '6',
    name: 'Classic Rocking Chair',
    price: 28000,
    image: `${IMAGE_BASE_URL}/rocking chair.png`,
    category: 'Rocking Chairs',
    slug: 'classic-rocking-chair'
  },
  {
    id: '7',
    name: 'Royal Blue Carved Sofa',
    price: 135000,
    image: `${IMAGE_BASE_URL}/sf_royal_blue_carved.png`,
    category: 'Sofas',
    slug: 'royal-blue-carved-sofa'
  },
  {
    id: '8',
    name: 'Baroque Cream Armchair',
    price: 55000,
    image: `${IMAGE_BASE_URL}/ac_baroque_cream.png`,
    category: 'Armchairs',
    slug: 'baroque-cream-armchair'
  },
  {
    id: '9',
    name: 'Carved Wood Rocking Chair',
    price: 32000,
    image: `${IMAGE_BASE_URL}/rc_carved_wood.png`,
    category: 'Rocking Chairs',
    slug: 'carved-wood-rocking-chair'
  },
  {
    id: '10',
    name: 'Pearl Channel Sofa',
    price: 95000,
    image: `${IMAGE_BASE_URL}/sf_pearl_channel.png`,
    category: 'Sofas',
    slug: 'pearl-channel-sofa'
  },
  {
    id: '11',
    name: 'Elegant French Armchair',
    price: 42000,
    image: `${IMAGE_BASE_URL}/Elegant French-style armchair in living room.png`,
    category: 'Armchairs',
    slug: 'elegant-french-armchair'
  },
  { 
    id: '12',
    name: 'Emerald Velvet Sofa',
    price: 83000,
    image: `${IMAGE_BASE_URL}/sf_emerald.png`,
    category: 'Sofas',
    slug: 'emerald-velvet-sofa'
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
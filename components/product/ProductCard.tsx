"use client"
import React from 'react'
import Link from 'next/link'
import { ShoppingBag, Eye, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WishlistButton from './WishlistButton'
import { useAddToCart } from '@/lib/hooks/useAddToCart'
import { cn } from '@/lib/utils'

interface ProductCardProps {
    id: string
    name: string
    price: number
    image: string
    category: string
    slug: string
}

import { useTranslation } from 'react-i18next'

const categoryMap: Record<string, string> = {
    'Living Room': 'categories.livingRoom',
    'Bedroom': 'categories.bedroom',
    'Dining': 'categories.dining',
    'Office': 'categories.office',
    'Outdoor': 'categories.outdoor',
    'Decor': 'categories.decor',
    'Armchairs': 'categories.armchairs'
}

export default function ProductCard({ id, name, price, image, category, slug }: ProductCardProps) {
    const { t } = useTranslation('common')
    const { addToCart, buyNow, status, isAdding, isAdded } = useAddToCart()
    const [imgError, setImgError] = React.useState(false)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(id)
    }

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        buyNow(id)
    }

    const getButtonContent = () => {
        if (isAdding) {
            return <Loader2 size={18} className="animate-spin" />
        }
        if (isAdded) {
            return <Check size={18} />
        }
        return <ShoppingBag size={18} />
    }

    const getButtonClass = () => {
        if (isAdded) return 'bg-green-500 hover:bg-green-600'
        if (isAdding) return 'opacity-70 cursor-wait'
        return ''
    }

    return (
        <div className="group relative w-full">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                <Link href={`/product/${slug}`} className="block h-full w-full">
                    <img
                        src={imgError ? '/placeholder.png' : image}
                        alt={name}
                        onError={() => setImgError(true)}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{
                            WebkitBackfaceVisibility: 'hidden',
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(0)'
                        }}
                    />
                </Link>

                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/80 to-transparent pt-10">
                    <div className="flex gap-2 justify-center mb-3">
                        <Button
                            size="icon"
                            variant="luxury"
                            className={cn("rounded-full h-10 w-10 transition-all", getButtonClass())}
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            title={isAdded ? t('messages.itemAddedToCart', 'Added to cart') : t('buttons.addToCart', 'Add to cart')}
                        >
                            {getButtonContent()}
                        </Button>
                        <Link href={`/product/${slug}`}>
                            <Button size="icon" variant="secondary" className="rounded-full h-10 w-10" title={t('buttons.viewDetails', 'View Details')}>
                                <Eye size={18} />
                            </Button>
                        </Link>
                        <WishlistButton
                            productId={id}
                            className="rounded-full h-10 w-10 bg-white/20 hover:bg-white/40 text-white hover:text-red-500 backdrop-blur-sm"
                        />
                    </div>

                    <Button
                        onClick={handleBuyNow}
                        disabled={isAdding}
                        className="w-full btn-luxury-black rounded-full h-11 text-xs transition-all duration-300"
                    >
                        {t('buttons.buyNow', 'Buy Now')}
                    </Button>
                </div>

                <div className="absolute top-2 left-2">
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 font-medium">
                    {t(categoryMap[category] || category, category)}
                </p>
                <Link href={`/product/${slug}`}>
                    <h3 className="text-lg font-heading font-semibold text-black transition-colors truncate luxury-product-name leading-snug">
                        {name}
                    </h3>
                </Link>
                <p className="text-lg font-heading font-black text-black luxury-price mt-1.5 tracking-wide">
                    ₹{price.toLocaleString('en-IN')}
                </p>
            </div>
        </div>
    )
}

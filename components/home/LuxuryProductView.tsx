"use client"
import Link from 'next/link'
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

interface LuxuryProductProps {
    id: string
    name: string
    price: number
    image: string
    category: string
    slug: string
}

export default function LuxuryProductView({ id, name, price, image, category, slug }: LuxuryProductProps) {
    const { t } = useTranslation(['common', 'product'])
    return (
        <div className="block w-full snap-center shrink-0 h-[90vh] flex flex-col justify-center mb-0">
            <Link href={`/product?slug=${slug}`} className="block relative w-full h-[60vh] overflow-hidden rounded-2xl mb-6 shadow-xl mx-auto max-w-[95%]">
                <img
                    src={image}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </Link>

            <div className="text-center px-6 flex flex-col items-center">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 font-medium">
                    {t(categoryMap[category] || category, category)}
                </p>
                <Link href={`/product?slug=${slug}`}>
                    <h3 className="text-2xl font-heading font-semibold text-black mb-2 leading-tight luxury-product-name">{name}</h3>
                </Link>
                <p className="text-xl font-heading font-black text-black luxury-price mb-6 tracking-wide">₹{Number(price).toLocaleString('en-IN')}</p>

                <Link
                    href={`/product?slug=${slug}`}
                    className="w-full max-w-[280px] btn-luxury-black py-4 rounded-full flex items-center justify-center gap-3 text-sm"
                >
                    {t('product:buyNow', 'Buy Now')}
                </Link>
            </div>
        </div>
    )
}

'use client'

import { CartItemData } from '@/types/cart'
import { Minus, Plus, X, Package, Heading3 } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface CartItemProps {
    item: CartItemData
    onQuantityChange: (id: string, quantity: number) => void
    onRemove: (id: string) => void
    isUpdating: boolean
}

export default function CartItem({
    item,
    onQuantityChange,
    onRemove,
    isUpdating
}: CartItemProps) {
    const { t } = useTranslation(['cart', 'product'])
    const { product, variant, quantity } = item
    const price = variant?.price ?? product.basePrice
    const image = product.images[0]?.imageUrl

    return (
        <div className="group flex flex-col sm:flex-row gap-4 sm:gap-5">
            <Link
                href={`/product/${product.slug}`}
                className="relative h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 shrink-0 overflow-hidden rounded-2xl bg-gray-100 border border-gray-100"
            >
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-10 w-10 text-gray-300" />
                    </div>
                )}
            </Link>

            <div className="flex flex-1 flex-col justify-between py-0 sm:py-1">
                <div className="flex justify-between gap-2 sm:gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0 overflow-hidden">
                        <Link
                            href={`/product/${product.slug}`}
                            className="block text-base sm:text-lg font-bold text-gray-900 hover:text-gray-600 transition-colors leading-tight overflow-hidden text-ellipsis whitespace-nowrap"
                            title={product.name}
                        >
                            {t('cart:labels.viewMore', 'view more')}
                        </Link>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
                            {t(`product:names.${product.slug.replace(/-/g, (match: string, offset: number) => offset > 0 ? match.toUpperCase().replace('-', '') : match).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`, product.name)}
                        </h2>


                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {variant?.color && (
                                <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
                                    <span
                                        className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ring-1 ring-gray-200"
                                        style={{ backgroundColor: variant.color.hexCode || '#ccc' }}
                                    />
                                    {variant.color.name}
                                </div>
                            )}
                            {variant?.size && (
                                <span className="px-2 py-0.5 sm:py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
                                    {variant.size}
                                </span>
                            )}
                            {variant?.material && (
                                <span className="px-2 py-0.5 sm:py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hidden sm:inline">
                                    {variant.material}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        disabled={isUpdating}
                        className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        aria-label={t('cart:labels.remove', 'Remove item')}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-3 sm:mt-4 gap-3">
                    <div className="flex items-center bg-gray-100 rounded-full">
                        <button
                            type="button"
                            onClick={() => onQuantityChange(item.id, quantity - 1)}
                            disabled={quantity <= 1 || isUpdating}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label={t('cart:labels.decrease', 'Decrease quantity')}
                        >
                            <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => onQuantityChange(item.id, quantity + 1)}
                            disabled={isUpdating}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label={t('cart:labels.increase', 'Increase quantity')}
                        >
                            <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                    </div>

                    <div className="text-right flex-shrink-0">
                        <p className="text-lg sm:text-xl font-black text-gray-900">
                            ₹{(Number(price) * quantity).toLocaleString('en-IN')}
                        </p>
                        {quantity > 1 && (
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                                ₹{Number(price).toLocaleString('en-IN')} {t('cart:labels.each', 'each')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
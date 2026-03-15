'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CartResponse } from '@/types/cart'
import CartList from './CartList'
import CartSummary from './CartSummary'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CartClientProps {
    initialCart: CartResponse | null
}

export default function CartClient({ initialCart }: CartClientProps) {
    const { t } = useTranslation(['cart', 'common'])
    const { data: cart } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await fetch('/api/cart')
            if (!res.ok) throw new Error('Failed to fetch cart')
            return res.json()
        },
        initialData: initialCart,
        staleTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    })

    if (!cart || cart.items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="min-h-[60vh] flex items-center justify-center py-20"
            >
                <div className="max-w-md text-center space-y-8">
                    {/* Animated bag illustration */}
                    <div className="relative w-40 h-40 mx-auto">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <motion.div
                                animate={{ y: [0, -8, 0], rotate: [0, -5, 0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ShoppingBag className="h-16 w-16 text-gray-300" strokeWidth={1.5} />
                            </motion.div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('cart:empty.title', 'Your cart is empty')}</h1>
                        <p className="text-gray-500 text-lg leading-relaxed max-w-sm mx-auto">
                            {t('cart:empty.tagline', 'Discover our collection of premium furniture and find pieces that inspire you.')}
                        </p>
                    </div>

                    <Link
                        href="/shop"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-lg font-semibold rounded-2xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                    >
                        <Sparkles className="h-5 w-5" />
                        {t('cart:empty.explore', 'Explore Collection')}
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{t('cart:badge', 'Shopping')}</p>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">{t('cart:title', 'Your Bag')}</h1>
                </div>
                <p className="text-gray-500 font-medium">
                    {cart.itemCount} {cart.itemCount === 1 ? t('cart:item', 'item') : t('cart:items', 'items')} {t('cart:readyForCheckout', 'ready for checkout')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-8 space-y-1">
                    <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                        <CartList items={cart.items} />
                    </div>

                    <div className="flex items-center justify-between py-4 px-2">
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                        >
                            <ArrowRight className="h-4 w-4 rotate-180" />
                            {t('cart:continueShopping', 'Continue Shopping')}
                        </Link>

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Sparkles className="h-4 w-4" />
                            <span className="font-medium">{t('cart:freeShippingAll', 'Free shipping on all orders')}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <CartSummary
                            subtotal={cart.subtotal}
                            itemCount={cart.itemCount}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

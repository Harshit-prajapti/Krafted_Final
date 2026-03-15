'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Gift, Tag } from 'lucide-react'
import { useState } from 'react'

interface CartSummaryProps {
    subtotal: number
    itemCount: number
}

import { useTranslation } from 'react-i18next'

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
    const { t } = useTranslation('cart')
    const [promoCode, setPromoCode] = useState('')
    const [promoApplied, setPromoApplied] = useState(false)

    const shipping = 0
    const tax = subtotal * 0.18
    const total = subtotal + shipping + tax

    const handleApplyPromo = () => {
        if (promoCode.toLowerCase() === 'krafted10') {
            setPromoApplied(true)
        }
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 text-white">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">{t('summary.title', 'Order Summary')}</h2>
                <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">{itemCount} {t('items', 'items')}</p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-500 font-medium">{t('summary.subtotal', 'Subtotal')}</p>
                        <p className="text-gray-900 font-bold">₹{subtotal.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-green-600" />
                            <p className="text-gray-500 font-medium">{t('summary.shipping', 'Shipping')}</p>
                        </div>
                        <p className="text-green-600 font-bold">{t('summary.freeShipping', 'FREE')}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-500 font-medium text-xs sm:text-sm">{t('summary.tax', 'Est. Tax (18% GST)')}</p>
                        <p className="text-gray-900 font-bold">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>

                    {promoApplied && (
                        <div className="flex items-center justify-between text-sm p-2 sm:p-3 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-green-600" />
                                <p className="text-green-700 font-bold text-xs sm:text-sm">KRAFTED10</p>
                            </div>
                            <p className="text-green-600 font-bold">-10%</p>
                        </div>
                    )}
                </div>

                <div className="pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-base sm:text-lg font-black text-gray-900">{t('summary.total', 'Total')}</p>
                        <div className="text-right">
                            <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                ₹{(promoApplied ? total * 0.9 : total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{t('summary.includingTax', 'Including GST')}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={t('promo.placeholder', 'Promo code')}
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            disabled={promoApplied}
                            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black disabled:bg-gray-50 disabled:text-gray-400 font-medium"
                        />
                        <button
                            onClick={handleApplyPromo}
                            disabled={!promoCode || promoApplied}
                            className="px-3 sm:px-5 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                        >
                            {promoApplied ? t('buttons.applied', 'Applied') : t('buttons.apply', 'Apply')}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Gift className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{t('promo.try', 'Try "KRAFTED10" for 10% off')}</span>
                    </div>
                </div>

                <Button
                    className="w-full h-14 sm:h-16 text-base sm:text-lg font-black bg-black text-white hover:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] group"
                    asChild
                >
                    <Link href="/checkout">
                        {t('summary.proceedToCheckout', 'Proceed to Checkout')}
                        <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>

                <div className="flex items-center justify-center gap-2 sm:gap-3 pt-2">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{t('summary.secure', 'Secure & Encrypted')}</span>
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('summary.weAccept', 'We Accept')}</p>
                    <div className="flex flex-wrap gap-2">
                        {['VISA', 'Mastercard', 'RuPay', 'UPI', 'Paytm', 'GPay'].map((method) => (
                            <div
                                key={method}
                                className="px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-xs font-bold text-gray-600 shadow-sm"
                            >
                                {method}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'

import { Package, Truck, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface CheckoutSummaryProps {
    cart: any
}

import { useTranslation } from 'react-i18next'

export default function CheckoutSummary({ cart }: CheckoutSummaryProps) {
    const { t } = useTranslation('checkout')
    const { t: tCommon } = useTranslation('common')
    const [showItems, setShowItems] = useState(true)

    const subtotal = cart.subtotal
    const tax = subtotal * 0.18
    const total = subtotal + tax

    const estimatedDelivery = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden sticky top-28">
            <div className="bg-gradient-to-br from-gray-900 to-black p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-white tracking-tight">{t('summary.title', 'Order Summary')}</h2>
                        <p className="text-gray-400 text-sm font-medium">{cart.itemCount} {cart.itemCount === 1 ? t('summary.item', 'item') : t('summary.items', 'items')}</p>
                    </div>
                    <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Package className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-5">
                <button
                    onClick={() => setShowItems(!showItems)}
                    className="w-full flex items-center justify-between py-3 text-sm font-bold text-gray-700 hover:text-black transition-colors"
                >
                    <span>{t('summary.itemsInOrder', 'Items in your order')}</span>
                    {showItems ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showItems && (
                    <div className="space-y-3 pb-4 border-b border-gray-100">
                        {cart.items.slice(0, 3).map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <div className="h-14 w-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    {item.product.images[0] ? (
                                        <img
                                            src={item.product.images[0].imageUrl}
                                            alt={item.product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Package className="h-6 w-6 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                                    <p className="text-xs text-gray-500">{tCommon('labels.qty', 'Qty')}: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900">
                                    ₹{(Number(item.variant?.price || item.product.basePrice) * item.quantity).toLocaleString('en-IN')}
                                </p>
                            </div>
                        ))}
                        {cart.items.length > 3 && (
                            <p className="text-xs text-gray-400 font-medium text-center pt-2">
                                +{cart.items.length - 3} {t('summary.moreItems', 'more items')}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t('summary.subtotal', 'Subtotal')}</span>
                        <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-green-600" />
                            <span className="text-gray-500">{t('summary.shipping', 'Shipping')}</span>
                        </div>
                        <span className="font-bold text-green-600">{t('summary.free', 'FREE')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t('summary.tax', 'Tax (18% GST)')}</span>
                        <span className="font-bold text-gray-900">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('summary.total', 'Total')}</p>
                            <p className="text-2xl font-black text-gray-900">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                        <p className="text-xs text-gray-400">{t('summary.incGst', 'Inc. GST')}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                    <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-amber-600" />
                        <div>
                            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">{t('summary.estimatedDelivery', 'Estimated Delivery')}</p>
                            <p className="text-sm font-bold text-amber-700">
                                {estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-gray-400">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('summary.secureCheckout', 'Secure Checkout')}</span>
                </div>
            </div>
        </div>
    )
}

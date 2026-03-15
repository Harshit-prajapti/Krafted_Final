'use client'

import { useState } from 'react'
import { CreditCard, Truck, ArrowLeft, Loader2, ShieldCheck, Smartphone, Building2, Wallet } from 'lucide-react'

interface PaymentStepProps {
    onBack: () => void
    onPlaceOrder: (method: string) => void
    isProcessing: boolean
    totalAmount?: number
}

export default function PaymentStep({ onBack, onPlaceOrder, isProcessing, totalAmount }: PaymentStepProps) {
    const [method, setMethod] = useState<'CARD' | 'COD'>('CARD')

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Payment Method</h2>
                    <p className="text-gray-500 font-medium">Select how you'd like to pay for your order.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div
                        onClick={() => setMethod('CARD')}
                        className={`group p-6 rounded-2xl border-2 transition-all cursor-pointer ${method === 'CARD'
                            ? 'border-black bg-gradient-to-br from-gray-50 to-white shadow-xl ring-2 ring-black/5'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl transition-all ${method === 'CARD'
                                    ? 'bg-black text-white shadow-lg'
                                    : 'bg-white text-gray-400 border border-gray-100 group-hover:border-gray-200'
                                    }`}>
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 text-lg">Pay Online</p>
                                    <p className="text-sm text-gray-500 font-medium">Secure payment via Razorpay</p>
                                </div>
                            </div>
                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${method === 'CARD'
                                ? 'border-black bg-black'
                                : 'border-gray-300'
                                }`}>
                                {method === 'CARD' && <div className="h-2 w-2 bg-white rounded-full" />}
                            </div>
                        </div>

                        {method === 'CARD' && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Accepted Methods</p>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <CreditCard className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-bold text-gray-700">Cards</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <Smartphone className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-bold text-gray-700">UPI</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <Building2 className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm font-bold text-gray-700">Netbanking</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <Wallet className="h-4 w-4 text-orange-600" />
                                        <span className="text-sm font-bold text-gray-700">Wallets</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="group p-6 rounded-2xl border-2 border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-white text-gray-300 border border-gray-100">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-black text-gray-400 text-lg">Cash on Delivery</p>
                                        <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-[10px] uppercase font-bold tracking-wider rounded-md">Unavailable</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">Currently disabled for your location</p>
                                </div>
                            </div>
                            <div className="h-6 w-6 rounded-full border-2 border-gray-200" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl flex items-start gap-4 border border-gray-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">100% Secure Transaction</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Your payment is protected with industry-standard 256-bit SSL encryption.
                            By placing this order, you agree to our Terms & Conditions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={onBack}
                    disabled={isProcessing}
                    className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Shipping
                </button>
                <button
                    disabled={isProcessing}
                    onClick={() => onPlaceOrder(method)}
                    className="group px-10 py-5 bg-black text-white text-lg font-black rounded-2xl shadow-xl hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-3 active:scale-[0.98] hover:shadow-2xl"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            {method === 'CARD' ? 'Pay Now' : 'Place Order'}
                            {totalAmount && (
                                <span className="ml-1 px-3 py-1 bg-white/20 rounded-lg text-sm">
                                    ₹{totalAmount.toLocaleString('en-IN')}
                                </span>
                            )}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

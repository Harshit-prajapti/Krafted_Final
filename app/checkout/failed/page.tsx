import { prisma } from '@/lib/prisma'
import { XCircle, RefreshCcw, ArrowLeft, ShoppingBag, AlertTriangle, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    searchParams: Promise<{ orderId?: string; reason?: string }>
}

export default async function CheckoutFailedPage({ searchParams }: PageProps) {
    const params = await searchParams
    const orderId = params.orderId
    const reason = params.reason

    let order = null
    if (orderId) {
        order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { id: true, totalAmount: true, status: true }
        })
    }

    const getErrorMessage = (reason?: string) => {
        switch (reason) {
            case 'BAD_REQUEST_ERROR':
                return 'The payment request was invalid. Please try again.'
            case 'GATEWAY_ERROR':
                return 'The payment gateway encountered an error. Please try again.'
            case 'NETWORK_ERROR':
                return 'Network connection lost during payment. Please check your connection and retry.'
            case 'verification_failed':
                return 'Payment verification failed. If money was deducted, it will be refunded within 5-7 days.'
            case 'verification_error':
                return 'An error occurred while verifying your payment. Please contact support.'
            default:
                return 'Your payment could not be processed. Please try again or use a different payment method.'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50/50 to-white py-20 px-4 mt-20">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-10">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse opacity-30" />
                        <div className="relative h-28 w-28 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-200">
                            <XCircle className="h-14 w-14 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-lg text-gray-500 font-medium">
                        {getErrorMessage(reason)}
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <p className="font-bold mb-1">Don't worry!</p>
                            <p className="text-amber-700">
                                Your order has been saved. You can retry the payment or choose a different payment method.
                            </p>
                        </div>
                    </div>

                    {order && (
                        <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-2xl">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Order ID</span>
                                <span className="font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold text-gray-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="font-bold text-red-600">Payment Failed</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {order && (
                            <Link
                                href={`/checkout?retry=${order.id}`}
                                className="w-full h-14 bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                <RefreshCcw className="h-5 w-5" />
                                Retry Payment
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            className="w-full h-14 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Return to Cart
                        </Link>

                        <Link
                            href="/shop"
                            className="w-full h-14 bg-white text-gray-500 rounded-2xl flex items-center justify-center gap-2 font-medium hover:text-gray-900 transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Need help with your order?</p>
                    <a
                        href="mailto:support@krafted.com"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Contact Support
                    </a>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <ShoppingBag className="h-4 w-4" />
                    Krafted Furniture
                </div>
            </div>
        </div>
    )
}

import { prisma } from '@/lib/prisma'
import { CheckCircle2, Package, Truck, CreditCard, Calendar, MapPin, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
    searchParams: Promise<{ orderId?: string; paymentId?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
    const params = await searchParams
    const orderId = params.orderId
    const paymentId = params.paymentId

    if (!orderId) notFound()

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: {
                        include: { images: { where: { isPrimary: true }, take: 1 } }
                    }
                }
            },
            shippingAddress: true,
            payments: { take: 1 }
        }
    })

    if (!order) notFound()

    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const isTestPayment = order.payments[0]?.transactionId?.startsWith('test_payment_') || false

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white py-20 px-4 mt-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25" />
                        <div className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-20 animation-delay-300" />
                        <div className="relative h-28 w-28 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
                            <CheckCircle2 className="h-14 w-14 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Order Confirmed!
                    </h1>
                    <p className="text-xl text-gray-500 font-medium max-w-md mx-auto">
                        Thank you for your purchase. Your premium furniture is on its way.
                    </p>

                    <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-lg">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                        <span className="text-lg font-black text-gray-900">#{orderId.slice(-8).toUpperCase()}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl">
                                    <Truck className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 text-lg">Delivery Status</p>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Expected by {estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold">
                                {order.status === 'CONFIRMED' ? 'Processing' : 'Created'}
                            </span>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center">
                                {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                                    <div key={step} className="flex flex-col items-center relative z-10">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${index === 0
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {index === 0 ? '✓' : index + 1}
                                        </div>
                                        <p className={`mt-2 text-xs font-bold ${index === 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 -z-0">
                                <div className="h-full bg-green-500 w-[12.5%]" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <p className="font-bold text-gray-900">Delivery Address</p>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p className="text-gray-400">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <p className="font-bold text-gray-900">Payment Details</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-bold text-gray-900">
                                        {isTestPayment
                                            ? 'Test Payment'
                                            : order.payments[0]?.provider === 'RAZORPAY'
                                                ? 'Razorpay'
                                                : 'Cash on Delivery'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                                {paymentId && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Transaction ID</span>
                                        <span className="font-mono text-xs text-gray-900">{paymentId.slice(-12)}</span>
                                    </div>
                                )}
                                <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-black text-xl text-gray-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="h-5 w-5 text-gray-400" />
                            <p className="font-bold text-gray-900">Order Items ({order.items.length})</p>
                        </div>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                        {item.product.images[0] ? (
                                            <img
                                                src={item.product.images[0].imageUrl}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.colorName && `${item.colorName}`}
                                            {item.size && ` • ${item.size}`}
                                            {` • Qty: ${item.quantity}`}
                                        </p>
                                    </div>
                                    <p className="font-bold text-gray-900">₹{Number(item.price).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            href="/shop"
                            className="flex-1 h-14 bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            Continue Shopping
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href={`/profile/orders/${orderId}`}
                            className="flex-1 h-14 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            <Package className="h-5 w-5" />
                            Track Order
                        </Link>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <ShoppingBag className="h-4 w-4" />
                    Krafted Furniture Experience
                </div>
            </div>
        </div>
    )
}

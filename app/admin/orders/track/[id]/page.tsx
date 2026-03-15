import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Package, User, MapPin, CreditCard, Truck, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface OrderTrackPageProps {
    params: Promise<{ id: string }>
}

export default async function OrderTrackPage({ params }: OrderTrackPageProps) {
    const { id } = await params

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true, phone: true } },
            shippingAddress: true,
            billingAddress: true,
            items: true,
            payments: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            shipping: true,
            history: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!order) {
        notFound()
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED': return 'bg-gray-100 text-gray-800'
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
            case 'SHIPPED': return 'bg-yellow-100 text-yellow-800'
            case 'DELIVERED': return 'bg-green-100 text-green-800'
            case 'CANCELLED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700'
            case 'PENDING': return 'bg-yellow-100 text-yellow-700'
            case 'FAILED': return 'bg-red-100 text-red-700'
            case 'REFUNDED': return 'bg-blue-100 text-blue-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-gray-500">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Package className="h-5 w-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-4 flex items-center gap-4">
                                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                        <div className="flex gap-2 text-sm text-gray-500">
                                            {item.colorName && <span>Color: {item.colorName}</span>}
                                            {item.size && <span>• Size: {item.size}</span>}
                                            {item.sku && <span>• SKU: {item.sku}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ₹{Number(item.price).toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="text-xl font-bold text-gray-900">
                                    ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Order Timeline</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {order.history.map((event, index) => (
                                    <div key={event.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                            {index < order.history.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-200 mt-1" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium text-gray-900">{event.status}</p>
                                            {event.notes && (
                                                <p className="text-sm text-gray-500">{event.notes}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDate(event.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Customer</h2>
                        </div>
                        <div className="p-6">
                            <p className="font-medium text-gray-900">{order.user.name}</p>
                            <p className="text-sm text-gray-500">{order.user.email}</p>
                            {order.user.phone && (
                                <p className="text-sm text-gray-500">{order.user.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Shipping Address</h2>
                        </div>
                        <div className="p-6">
                            <p className="font-medium text-gray-900">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && (
                                <p className="text-sm text-gray-500">{order.shippingAddress.addressLine2}</p>
                            )}
                            <p className="text-sm text-gray-500">
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                            <p className="text-sm text-gray-500">
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Phone: {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Payment</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.payments[0] && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment ID</span>
                                        <span className="text-gray-900 font-mono text-sm">
                                            {order.payments[0].transactionId || order.payments[0].id.slice(-8)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Method</span>
                                        <span className="text-gray-900">
                                            {order.payments[0].provider === 'RAZORPAY' ? 'Razorpay' : 'Cash on Delivery'}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between pt-3 border-t border-gray-100">
                                <span className="font-medium text-gray-900">Amount</span>
                                <span className="font-bold text-gray-900">
                                    ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {order.shipping && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-indigo-600" />
                                <h2 className="font-semibold text-gray-900">Shipping</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {order.shipping.trackingNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tracking</span>
                                        <span className="text-gray-900 font-mono text-sm">
                                            {order.shipping.trackingNumber}
                                        </span>
                                    </div>
                                )}
                                {order.shipping.carrier && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Carrier</span>
                                        <span className="text-gray-900">{order.shipping.carrier}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className="text-gray-900">{order.shipping.status}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, MapPin, CreditCard, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderDetailsClientProps {
    order: any
}

export default function OrderDetailsClient({ order }: OrderDetailsClientProps) {
    const router = useRouter()
    const [isCancelling, setIsCancelling] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            CREATED: 'bg-blue-100 text-blue-700 border-blue-200',
            CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
            SHIPPED: 'bg-purple-100 text-purple-700 border-purple-200',
            DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            CANCELLED: 'bg-red-100 text-red-700 border-red-200',
        }
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CREATED':
                return <Package className="h-5 w-5" />
            case 'CONFIRMED':
                return <CheckCircle className="h-5 w-5" />
            case 'SHIPPED':
                return <Truck className="h-5 w-5" />
            case 'DELIVERED':
                return <CheckCircle className="h-5 w-5" />
            case 'CANCELLED':
                return <XCircle className="h-5 w-5" />
            default:
                return <Package className="h-5 w-5" />
        }
    }

    const canCancelOrder = () => {
        return order.status === 'CREATED' || order.status === 'CONFIRMED'
    }

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return
        }

        setIsCancelling(true)

        try {
            const res = await fetch(`/api/orders/${order.id}/cancel`, {
                method: 'POST'
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert('Failed to cancel order')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred')
        } finally {
            setIsCancelling(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {canCancelOrder() && (
                        <Button
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="rounded-xl"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900">Order Status</h2>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="font-bold text-sm">{order.status}</span>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        {order.history && order.history.length > 0 && (
                            <div className="space-y-4">
                                {order.history.map((item: any, index: number) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[#c9a24d]' : 'bg-gray-300'}`} />
                                            {index !== order.history.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-200 mt-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-bold text-gray-900">{item.status}</p>
                                            <p className="text-sm text-gray-500">{formatDate(item.createdAt)}</p>
                                            {item.notes && (
                                                <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Shipping Info */}
                        {order.shipping && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <Truck className="h-5 w-5 text-gray-600" />
                                    <h3 className="font-bold text-gray-900">Shipping Information</h3>
                                </div>
                                {order.shipping.trackingNumber && (
                                    <p className="text-sm text-gray-600">
                                        Tracking: <span className="font-mono font-bold text-gray-900">{order.shipping.trackingNumber}</span>
                                    </p>
                                )}
                                {order.shipping.carrier && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Carrier: <span className="font-semibold">{order.shipping.carrier}</span>
                                    </p>
                                )}
                                {order.shipping.estimatedDelivery && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Estimated Delivery: <span className="font-semibold">{formatDate(order.shipping.estimatedDelivery)}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-6">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                    {item.product.images[0] && (
                                        <img
                                            src={item.product.images[0].imageUrl}
                                            alt={item.product.images[0].altText || item.productName}
                                            className="w-20 h-20 object-cover rounded-xl"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{item.productName}</h3>
                                        {item.colorName && (
                                            <p className="text-sm text-gray-600">Color: {item.colorName}</p>
                                        )}
                                        {item.size && (
                                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                                        )}
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900">₹{Number(item.price).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">per item</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary & Address */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{Number(order.totalAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-black text-xl text-gray-900">₹{Number(order.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-semibold text-gray-700">Payment Status</span>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-black text-gray-900">Shipping Address</h2>
                        </div>
                        <div className="text-sm space-y-1">
                            <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                            <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && (
                                <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                            )}
                            <p className="text-gray-600">
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-gray-600">{order.shippingAddress.country}</p>
                            <p className="text-gray-600 mt-2">Phone: {order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-blue-900 mb-1">Need Help?</h3>
                                <p className="text-sm text-blue-700 mb-3">
                                    Have questions about your order? We're here to help!
                                </p>
                                <Link href="/contact" className="text-sm font-bold text-blue-600 hover:underline">
                                    Contact Support →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

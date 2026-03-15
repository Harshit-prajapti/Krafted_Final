'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface OrdersClientProps {
    orders: any[]
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
}

export default function OrdersClient({ orders }: OrdersClientProps) {
    const getStatusConfig = (status: string) => {
        const configs: Record<string, { bg: string, text: string, iconBg: string, icon: typeof Clock }> = {
            CREATED: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100', icon: Clock },
            CONFIRMED: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100', icon: CheckCircle },
            SHIPPED: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100', icon: Truck },
            DELIVERED: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100', icon: CheckCircle },
            CANCELLED: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', iconBg: 'bg-red-100', icon: XCircle },
        }
        return configs[status] || { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', iconBg: 'bg-gray-100', icon: Package }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const totalOrders = orders.length
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length

    if (orders.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
            >
                {/* Animated package illustration */}
                <div className="relative w-40 h-40 mx-auto mb-8">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Package className="h-16 w-16 text-gray-300" strokeWidth={1.5} />
                        </motion.div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">No orders yet</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">
                    Your order history will appear here once you make your first purchase.
                </p>

                <Link
                    href="/shop"
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-lg font-semibold rounded-2xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                    <ShoppingBag className="h-5 w-5" />
                    Start Shopping
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 p-5 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl border border-gray-100"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                        <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 rounded-xl">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
                        <p className="text-sm text-gray-500">Delivered</p>
                    </div>
                </div>
            </motion.div>

            {/* Orders list */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                {orders.map((order, index) => {
                    const statusConfig = getStatusConfig(order.status)
                    const StatusIcon = statusConfig.icon

                    return (
                        <motion.div key={order.id} variants={itemVariants}>
                            <Link
                                href={`/profile/orders/${order.id}`}
                                className="block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/30 transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className="p-6 pb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 ${statusConfig.iconBg} rounded-2xl`}>
                                                <StatusIcon className={`h-6 w-6 ${statusConfig.text}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                                                        Order #{order.id.slice(-8).toUpperCase()}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.text}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Placed on {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-6 w-6 text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Product images strip */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                        {order.items.slice(0, 4).map((item: any, i: number) => (
                                            <div
                                                key={item.id}
                                                className="relative flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-hover:border-amber-200 transition-colors"
                                            >
                                                {item.product?.images?.[0] ? (
                                                    <img
                                                        src={item.product.images[0].imageUrl}
                                                        alt={item.productName || 'Product'}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-6 w-6 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                                                <p className="text-sm font-bold text-gray-600">+{order.items.length - 4}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tracking info */}
                                {order.shipping?.trackingNumber && (
                                    <div className="px-6 pb-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 pt-4 text-sm">
                                            <Truck className="h-4 w-4 text-purple-500" />
                                            <span className="text-gray-500">Tracking:</span>
                                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                                                {order.shipping.trackingNumber}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}

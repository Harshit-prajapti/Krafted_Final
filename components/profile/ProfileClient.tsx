"use client"
import React, { useState } from "react"
import { motion, Variants } from "framer-motion"
import {
    User, Mail, Phone, Calendar, MapPin, Package, Settings, LogOut,
    Edit2, Save, X, Sparkles, ChevronRight, Crown, Shield, Heart,
    CreditCard, Truck, Clock, Award, TrendingUp, Star, Gift
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ProfileClientProps {
    user: {
        id: string
        name: string
        email: string
        phone: string | null
        image: string | null
        role: string
        createdAt: string
    }
    orders: Array<{
        id: string
        totalAmount: number
        status: string
        createdAt: string
    }>
    addresses: Array<{
        id: string
        fullName: string | null
        addressLine1: string
        city: string
        postalCode: string
        isDefault: boolean
    }>
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

const quickActions = [
    { href: '/profile/orders', icon: Package, label: 'Orders', color: 'from-blue-500 to-indigo-600' },
    { href: '/wishlist', icon: Heart, label: 'Wishlist', color: 'from-rose-500 to-pink-600' },
    { href: '/profile/addresses', icon: MapPin, label: 'Addresses', color: 'from-emerald-500 to-teal-600' },
    { href: '/profile/settings', icon: Settings, label: 'Settings', color: 'from-slate-600 to-slate-800' },
]

export default function ProfileClient({ user, orders, addresses }: ProfileClientProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(user.name)
    const [editedPhone, setEditedPhone] = useState(user.phone || "")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editedName,
                    phone: editedPhone || null
                })
            })

            if (res.ok) {
                setIsEditing(false)
                router.refresh()
            } else {
                alert('Failed to update profile')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { bg: string, text: string, icon: typeof Clock }> = {
            CREATED: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Clock },
            CONFIRMED: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Shield },
            SHIPPED: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Truck },
            DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Award },
            CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', icon: X },
        }
        return configs[status] || { bg: 'bg-gray-50', text: 'text-gray-700', icon: Package }
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length

    return (
        <motion.div
            className="max-w-7xl mx-auto space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Compact Header */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {/* Compact Avatar */}
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {user.role === 'ADMIN' && (
                                    <div className="absolute -top-1 -right-1 p-1 bg-amber-400 rounded-lg shadow-md">
                                        <Crown className="h-3.5 w-3.5 text-white" />
                                    </div>
                                )}
                            </motion.div>

                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-md text-xs font-semibold text-amber-700">
                                        <Star className="h-3 w-3 fill-current" />
                                        Gold
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Joined {formatDate(user.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                variant="outline"
                                size="sm"
                                className="font-semibold"
                            >
                                <Edit2 className="mr-1.5 h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="sm"
                                className="font-semibold text-gray-600 hover:text-gray-900"
                            >
                                <LogOut className="mr-1.5 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <Package className="h-6 w-6 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">{orders.length}</p>
                    <p className="text-sm opacity-90">Total Orders</p>
                </div>
                <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CreditCard className="h-6 w-6 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">₹{(totalSpent / 1000).toFixed(1)}k</p>
                    <p className="text-sm opacity-90">Total Spent</p>
                </div>
                <div className="group bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <Award className="h-6 w-6 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">{deliveredOrders}</p>
                    <p className="text-sm opacity-90">Completed</p>
                </div>
                <div className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <MapPin className="h-6 w-6 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">{addresses.length}</p>
                    <p className="text-sm opacity-90">Addresses</p>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="group relative bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                            <div className="relative flex items-center gap-3">
                                <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg shadow-sm`}>
                                    <action.icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">{action.label}</span>
                            </div>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={editedPhone}
                                onChange={(e) => setEditedPhone(e.target.value)}
                                placeholder="+91 12345 67890"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditedName(user.name)
                                    setEditedPhone(user.phone || "")
                                }}
                                variant="outline"
                                className="flex-1 font-semibold"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                            <Link
                                href="/profile/orders"
                                className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                            >
                                View All
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="font-semibold text-gray-900 mb-1">No orders yet</p>
                                <p className="text-gray-500 text-sm mb-4">Start shopping to see your orders here</p>
                                <Link href="/shop" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                                    Browse Collection
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.slice(0, 5).map((order) => {
                                    const statusConfig = getStatusConfig(order.status)
                                    const StatusIcon = statusConfig.icon
                                    return (
                                        <Link
                                            key={order.id}
                                            href={`/profile/orders/${order.id}`}
                                            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 ${statusConfig.bg} rounded-lg border border-gray-100`}>
                                                    <StatusIcon className={`h-5 w-5 ${statusConfig.text}`} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                                                        #{order.id.slice(0, 8).toUpperCase()}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold mt-1 ${statusConfig.bg} ${statusConfig.text}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Saved Addresses */}
                <motion.div variants={itemVariants}>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Addresses</h2>
                            <Link
                                href="/profile/addresses"
                                className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                            >
                                Manage
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <MapPin className="h-7 w-7 text-gray-400" />
                                </div>
                                <p className="font-semibold text-gray-900 mb-1">No addresses</p>
                                <p className="text-gray-500 text-sm">Add a delivery address</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {addresses.slice(0, 3).map((address) => (
                                    <div key={address.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="font-semibold text-gray-900 text-sm">{address.fullName}</p>
                                            {address.isDefault && (
                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-1">{address.addressLine1}</p>
                                        <p className="text-xs text-gray-500 mt-1">{address.city}, {address.postalCode}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
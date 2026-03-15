'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Loader2, ShoppingBag, ArrowRight, X } from 'lucide-react'
import { useWishlist } from '@/lib/hooks/useWishlist'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4 }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: -10,
        transition: { duration: 0.3 }
    }
}

export default function WishlistClient() {
    // ═══════════════════════════════════════════════════════════════
    // Use the modular useWishlist hook
    // ═══════════════════════════════════════════════════════════════
    const {
        items,
        isLoading,
        isError,
        isEmpty,
        itemCount,
        removeItem,
        isRemoving,
        removingProductId,
        refetch
    } = useWishlist()

    // ═══════════════════════════════════════════════════════════════
    // Loading State
    // ═══════════════════════════════════════════════════════════════
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Heart className="h-12 w-12 text-rose-300" />
                </motion.div>
                <p className="mt-4 text-gray-500 font-medium">Loading your favorites...</p>
            </div>
        )
    }

    // ═══════════════════════════════════════════════════════════════
    // Error State
    // ═══════════════════════════════════════════════════════════════
    if (isError) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl border border-red-100"
            >
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    We couldn't load your wishlist. Please try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-8 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                    Try Again
                </button>
            </motion.div>
        )
    }

    // ═══════════════════════════════════════════════════════════════
    // Empty State
    // ═══════════════════════════════════════════════════════════════
    if (isEmpty) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-24"
            >
                {/* Animated heart illustration */}
                <div className="relative w-40 h-40 mx-auto mb-8">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute inset-4 bg-gradient-to-br from-rose-50 to-white rounded-full flex items-center justify-center shadow-inner"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Heart className="h-16 w-16 text-rose-300" strokeWidth={1.5} />
                        </motion.div>
                    </motion.div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">Your wishlist is waiting</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                    Save your favorite pieces and create your dream furniture collection.
                </p>

                <Link
                    href="/shop"
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-lg font-semibold rounded-2xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                    <ShoppingBag className="h-5 w-5" />
                    Discover Products
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        )
    }

    // ═══════════════════════════════════════════════════════════════
    // Main Wishlist View
    // ═══════════════════════════════════════════════════════════════
    return (
        <div className="space-y-8">
            {/* Stats bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 rounded-2xl border border-rose-100"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Saved Items</p>
                        <p className="text-xl font-bold text-gray-900">
                            {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
                        </p>
                    </div>
                </div>
                <Link
                    href="/shop"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-100 rounded-xl transition-colors"
                >
                    Add More
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </motion.div>

            {/* Product grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                        if (!item?.product) return null
                        const isCurrentlyRemoving = isRemoving && removingProductId === item.product.id

                        return (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                layout
                                exit="exit"
                                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300"
                            >
                                {/* Product Image */}
                                <Link href={`/product/${item.product.slug}`} className="block">
                                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                                        <img
                                            src={item.product.images?.[0]?.url || '/placeholder.png'}
                                            alt={item.product.name}
                                            // fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>

                                {/* Remove button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeItem(item.product.id)}
                                    disabled={isCurrentlyRemoving}
                                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-rose-50 transition-colors disabled:opacity-50 z-10"
                                    title="Remove from wishlist"
                                >
                                    {isCurrentlyRemoving ? (
                                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                                    ) : (
                                        <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                                    )}
                                </motion.button>

                                {/* Product Info */}
                                <div className="p-5">
                                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">
                                        {item.product.categories?.[0]?.category?.name || 'Furniture'}
                                    </p>
                                    <Link href={`/product/${item.product.slug}`}>
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold text-gray-900">
                                            ₹{Number(item.product.price).toLocaleString('en-IN')}
                                        </p>
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors"
                                        >
                                            View
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

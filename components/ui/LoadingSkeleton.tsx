'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
    count?: number
}

export default function LoadingSkeleton({ count = 12 }: LoadingSkeletonProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm"
                >
                    {/* Image skeleton */}
                    <div className="relative h-64 bg-gray-200 animate-pulse overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>

                    {/* Content skeleton */}
                    <div className="p-4 space-y-3">
                        {/* Category */}
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>

                        {/* Title */}
                        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>

                        {/* Price */}
                        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

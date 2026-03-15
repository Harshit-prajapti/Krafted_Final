'use client'

import React from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterBadgesProps {
    filters: {
        categories?: Array<{ id: string; name: string }>
        colors?: Array<{ id: string; name: string }>
        materials?: string[]
        priceRange?: { min: string; max: string }
    }
    onRemoveCategory?: (id: string) => void
    onRemoveColor?: (id: string) => void
    onRemoveMaterial?: (material: string) => void
    onClearPriceRange?: () => void
    onClearAll?: () => void
}

export default function FilterBadges({
    filters,
    onRemoveCategory,
    onRemoveColor,
    onRemoveMaterial,
    onClearPriceRange,
    onClearAll
}: FilterBadgesProps) {
    const hasActiveFilters =
        (filters.categories && filters.categories.length > 0) ||
        (filters.colors && filters.colors.length > 0) ||
        (filters.materials && filters.materials.length > 0) ||
        (filters.priceRange && (filters.priceRange.min || filters.priceRange.max))

    if (!hasActiveFilters) return null

    return (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
                <button
                    onClick={onClearAll}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                    {/* Category Badges */}
                    {filters.categories?.map((category) => (
                        <motion.span
                            key={`cat-${category.id}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                            <span className="text-xs opacity-70">Category:</span>
                            {category.name}
                            <button
                                onClick={() => onRemoveCategory?.(category.id)}
                                className="ml-1 hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${category.name} filter`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    ))}

                    {/* Color Badges */}
                    {filters.colors?.map((color) => (
                        <motion.span
                            key={`color-${color.id}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                            <span className="text-xs opacity-70">Color:</span>
                            {color.name}
                            <button
                                onClick={() => onRemoveColor?.(color.id)}
                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${color.name} filter`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    ))}

                    {/* Material Badges */}
                    {filters.materials?.map((material) => (
                        <motion.span
                            key={`material-${material}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:bg-green-100 transition-colors"
                        >
                            <span className="text-xs opacity-70">Material:</span>
                            {material}
                            <button
                                onClick={() => onRemoveMaterial?.(material)}
                                className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${material} filter`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    ))}

                    {/* Price Range Badge */}
                    {filters.priceRange && (filters.priceRange.min || filters.priceRange.max) && (
                        <motion.span
                            key="price-range"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200 hover:bg-purple-100 transition-colors"
                        >
                            <span className="text-xs opacity-70">Price:</span>
                            {filters.priceRange.min && `₹${filters.priceRange.min}`}
                            {filters.priceRange.min && filters.priceRange.max && ' - '}
                            {filters.priceRange.max && `₹${filters.priceRange.max}`}
                            <button
                                onClick={onClearPriceRange}
                                className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                aria-label="Remove price filter"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

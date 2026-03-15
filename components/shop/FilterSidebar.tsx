'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface FilterSidebarProps {
    className?: string
}

interface Category {
    id: string
    name: string
    slug: string
    _count: { products: number }
}

interface Color {
    id: string
    name: string
    hexCode: string | null
}

export default function FilterSidebar({ className }: FilterSidebarProps) {
    const { t } = useTranslation('shop')
    const router = useRouter()
    const searchParams = useSearchParams()

    const [categories, setCategories] = useState<Category[]>([])
    const [colors, setColors] = useState<Color[]>([])
    const [materials, setMaterials] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    // Multi-select state
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' })

    // Collapsible sections state
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        color: true,
        material: true,
        price: true
    })

    useEffect(() => {
        // Fetch categories
        fetch('/api/categories?isActive=true')
            .then(res => res.json())
            .then(data => setCategories(data || []))
            .catch(err => console.error('Error fetching categories:', err))

        // Fetch colors
        fetch('/api/colors')
            .then(res => res.json())
            .then(data => setColors(data || []))
            .catch(err => console.error('Error fetching colors:', err))

        // Fetch unique materials from products (you might want to create an API for this)
        fetch('/api/products?pageSize=100')
            .then(res => res.json())
            .then(data => {
                const uniqueMaterials = Array.from(
                    new Set(
                        (data.data || [])
                            .map((p: any) => p.material)
                            .filter((m: any) => m)
                    )
                ) as string[]
                setMaterials(uniqueMaterials)
            })
            .catch(err => console.error('Error fetching materials:', err))
            .finally(() => setLoading(false))

        // Initialize from URL params
        const categoryParams = searchParams.getAll('categoryId')
        const colorParams = searchParams.getAll('colorId')
        const materialParams = searchParams.getAll('material')

        setSelectedCategories(categoryParams)
        setSelectedColors(colorParams)
        setSelectedMaterials(materialParams)
        setPriceRange({
            min: searchParams.get('minPrice') || '',
            max: searchParams.get('maxPrice') || ''
        })
    }, [])

    const updateFilters = () => {
        const params = new URLSearchParams()

        selectedCategories.forEach(id => params.append('categoryId', id))
        selectedColors.forEach(id => params.append('colorId', id))
        selectedMaterials.forEach(mat => params.append('material', mat))

        if (priceRange.min) params.set('minPrice', priceRange.min)
        if (priceRange.max) params.set('maxPrice', priceRange.max)

        router.push(`/shop?${params.toString()}`)
    }

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev => {
            const newSelection = prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
            return newSelection
        })
    }

    const handleColorToggle = (colorId: string) => {
        setSelectedColors(prev => {
            const newSelection = prev.includes(colorId)
                ? prev.filter(id => id !== colorId)
                : [...prev, colorId]
            return newSelection
        })
    }

    const handleMaterialToggle = (material: string) => {
        setSelectedMaterials(prev => {
            const newSelection = prev.includes(material)
                ? prev.filter(m => m !== material)
                : [...prev, material]
            return newSelection
        })
    }

    useEffect(() => {
        updateFilters()
    }, [selectedCategories, selectedColors, selectedMaterials])

    const handlePriceApply = () => {
        updateFilters()
    }

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedColors([])
        setSelectedMaterials([])
        setPriceRange({ min: '', max: '' })
        router.push('/shop')
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    if (loading) {
        return (
            <aside className={`w-64 space-y-6 ${className}`}>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i}>
                            <div className="h-6 bg-gray-200 rounded w-32 mb-3" />
                            <div className="space-y-2">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="h-8 bg-gray-100 rounded" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        )
    }

    return (
        <aside className={`w-64 space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h3 className="text-xl font-heading font-semibold text-gold-dark">{t('filters.title', 'Filters')}</h3>
                {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedMaterials.length > 0 || priceRange.min || priceRange.max) && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                        {t('filters.clearFilters', 'Clear All')}
                    </button>
                )}
            </div>

            {/* Categories */}
            < div >
                <button
                    onClick={() => toggleSection('category')}
                    className="flex justify-between items-center w-full mb-3 group"
                >
                    <h4 className="text-base font-heading font-medium text-gray-900">{t('filters.categories', 'Category')}</h4>
                    {expandedSections.category ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    )}
                </button>

                <AnimatePresence initial={false}>
                    {expandedSections.category && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2 overflow-hidden"
                        >
                            {categories.map(category => (
                                <li key={category.id} className="flex items-center gap-2.5 group">
                                    <input
                                        type="checkbox"
                                        id={`cat-${category.id}`}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="rounded border-gray-300 text-gold focus:ring-gold h-4 w-4 cursor-pointer transition-all"
                                    />
                                    <label
                                        htmlFor={`cat-${category.id}`}
                                        className="text-sm text-gray-700 hover:text-gold cursor-pointer transition-colors group-hover:translate-x-1 duration-200 inline-block flex-1"
                                    >
                                        {category.name}
                                        <span className="text-gray-400 ml-1">({category._count.products})</span>
                                    </label>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div >

            <div className="w-full h-px bg-gray-200" />

            {/* Colors */}
            <div>
                <button
                    onClick={() => toggleSection('color')}
                    className="flex justify-between items-center w-full mb-3 group"
                >
                    <h4 className="text-base font-heading font-medium text-gray-900">{t('filters.color', 'Color')}</h4>
                    {expandedSections.color ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    )}
                </button>

                <AnimatePresence initial={false}>
                    {expandedSections.color && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-wrap gap-3 overflow-hidden"
                        >
                            {colors.map(color => (
                                <button
                                    key={color.id}
                                    onClick={() => handleColorToggle(color.id)}
                                    className={`relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${selectedColors.includes(color.id)
                                        ? 'border-gold ring-2 ring-gold/30 scale-110'
                                        : 'border-gray-300 hover:border-gold'
                                        }`}
                                    style={{ backgroundColor: color.hexCode || '#ccc' }}
                                    title={color.name}
                                >
                                    {selectedColors.includes(color.id) && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-800" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {
                materials.length > 0 && (
                    <>
                        <div className="w-full h-px bg-gray-200" />

                        {/* Materials */}
                        <div>
                            <button
                                onClick={() => toggleSection('material')}
                                className="flex justify-between items-center w-full mb-3 group"
                            >
                                <h4 className="text-base font-heading font-medium text-gray-900">{t('filters.material', 'Material')}</h4>
                                {expandedSections.material ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                                )}
                            </button>

                            <AnimatePresence initial={false}>
                                {expandedSections.material && (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        {materials.map(material => (
                                            <li key={material} className="flex items-center gap-2.5 group">
                                                <input
                                                    type="checkbox"
                                                    id={`mat-${material}`}
                                                    checked={selectedMaterials.includes(material)}
                                                    onChange={() => handleMaterialToggle(material)}
                                                    className="rounded border-gray-300 text-gold focus:ring-gold h-4 w-4 cursor-pointer transition-all"
                                                />
                                                <label
                                                    htmlFor={`mat-${material}`}
                                                    className="text-sm text-gray-700 hover:text-gold cursor-pointer transition-colors group-hover:translate-x-1 duration-200 inline-block flex-1"
                                                >
                                                    {material}
                                                </label>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )
            }

            <div className="w-full h-px bg-gray-200" />

            {/* Price Range */}
            <div>
                <button
                    onClick={() => toggleSection('price')}
                    className="flex justify-between items-center w-full mb-3 group"
                >
                    <h4 className="text-base font-heading font-medium text-gray-900">{t('filters.priceRange', 'Price Range')}</h4>
                    {expandedSections.price ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    )}
                </button>

                <AnimatePresence initial={false}>
                    {expandedSections.price && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3 overflow-hidden"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder={t('filters.min', 'Min')}
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold transition-all text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder={t('filters.max', 'Max')}
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold transition-all text-sm"
                                />
                            </div>
                            <button
                                onClick={handlePriceApply}
                                className="w-full px-4 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-md hover:shadow-lg hover:scale-[1.02] transition-all font-medium text-sm"
                            >
                                {t('buttons.apply', 'Apply Price Filter')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </aside >
    )
}

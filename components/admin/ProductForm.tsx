'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { z } from 'zod'

// Zod Schema for Validation
const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    basePrice: z.number().min(0, "Price must be a positive number"),
    material: z.string().optional(),
    dimensions: z.string().optional(),
    categoryIds: z.array(z.string()).min(1, "At least one category is required"),
    colorIds: z.array(z.string()).optional(),
    isActive: z.boolean().default(true)
})

interface ProductFormProps {
    categories: any[]
    colors: any[]
    initialData?: any
}

export default function ProductForm({ categories, colors, initialData }: ProductFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<string[]>(initialData?.images?.map((img: any) => img.imageUrl) || [])
    const [newImageUrl, setNewImageUrl] = useState('')

    // Form Errors State
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        basePrice: initialData?.basePrice?.toString() || '',
        material: initialData?.material || '',
        dimensions: initialData?.dimensions || '',
        categoryIds: initialData?.categories?.map((pc: any) => pc.categoryId) || [] as string[],
        colorIds: initialData?.colors?.map((pc: any) => pc.colorId) || [] as string[],
        isActive: initialData?.isActive ?? true
    })

    const handleGenerateSlug = () => {
        if (initialData) return
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        setFormData(prev => ({ ...prev, slug }))
    }

    const handleAddImage = () => {
        if (newImageUrl) {
            // Basic URL validation
            try {
                new URL(newImageUrl)
                setImages([...images, newImageUrl])
                setNewImageUrl('')
            } catch {
                alert("Please enter a valid URL")
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        // 1. Prepare Data
        const rawData = {
            ...formData,
            basePrice: parseFloat(formData.basePrice),
            colorIds: formData.colorIds
        }

        // 2. Validate with Zod
        const result = productSchema.safeParse(rawData)

        if (!result.success) {
            const newErrors: { [key: string]: string } = {}
            result.error.errors.forEach(err => {
                const path = err.path[0] as string
                newErrors[path] = err.message
            })
            setErrors(newErrors)
            setIsSubmitting(false)
            return
        }

        try {
            const payload = {
                ...result.data,
                images: images.map((url, index) => ({
                    imageUrl: url,
                    isPrimary: index === 0,
                    priority: index + 1
                }))
            }

            const url = initialData ? `/api/products/${initialData.id}` : '/api/products'
            const method = initialData ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                // Handle duplicate slug specific error
                if (res.status === 409) {
                    setErrors({ slug: "This slug is already in use. Please change it." })
                } else {
                    throw new Error(data.error || `Failed to ${initialData ? 'update' : 'create'} product`)
                }
                return
            }

            // Success feedback could be better (toast), using alert for now as strictly requested "work them" first
            // alert('Product saved successfully!') 
            router.push('/admin/products')
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert(error.message || 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        onBlur={handleGenerateSlug}
                        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Slug</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        className={`w-full p-2 border rounded-md bg-gray-50 ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Base Price (₹)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.basePrice ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.basePrice && <p className="text-xs text-red-500">{errors.basePrice}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Material</label>
                    <input
                        type="text"
                        value={formData.material}
                        onChange={e => setFormData({ ...formData, material: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Dimensions</label>
                    <input
                        type="text"
                        value={formData.dimensions}
                        onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active / Visible</label>
                </div>
            </div>

            {/* Relations */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Categories & Colors</h3>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Categories <span className="text-red-500">*</span></label>
                    <select
                        multiple
                        className={`w-full p-2 border rounded-md h-32 ${errors.categoryIds ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.categoryIds}
                        onChange={e => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value)
                            setFormData({ ...formData, categoryIds: selected })
                        }}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                        ))}
                    </select>
                    {errors.categoryIds && <p className="text-xs text-red-500">{errors.categoryIds}</p>}
                    <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Available Colors</label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map(color => (
                            <label key={color.id} className="inline-flex items-center gap-2 cursor-pointer border border-gray-200 p-2 rounded hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    value={color.id}
                                    checked={formData.colorIds.includes(color.id)}
                                    onChange={e => {
                                        const checked = e.target.checked
                                        setFormData(prev => ({
                                            ...prev,
                                            colorIds: checked
                                                ? [...prev.colorIds, color.id]
                                                : prev.colorIds.filter((id: string) => id !== color.id)
                                        }))
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="h-4 w-4 rounded-full border border-gray-300" style={{ backgroundColor: color.hexCode || '#eee' }}></span>
                                <span className="text-sm text-gray-700">{color.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Product Images</h3>

                <div className="flex gap-2">
                    <input
                        type="url"
                        placeholder="Enter image URL (e.g., Cloudinary)"
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                        Add URL
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group">
                            <div className="relative w-full h-full">
                                <img src={url} alt={`Product ${idx}`} className="object-cover w-full h-full" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                            </button>
                            {idx === 0 && (
                                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Primary</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isSubmitting ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    )
}

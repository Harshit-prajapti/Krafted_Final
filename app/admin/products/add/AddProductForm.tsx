'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import Image from 'next/image'

interface AddProductFormProps {
    categories: any[]
    colors: any[]
}

export default function AddProductForm({ categories, colors }: AddProductFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [newImageUrl, setNewImageUrl] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        basePrice: '',
        material: '',
        dimensions: '',
        categoryIds: [] as string[],
        colorIds: [] as string[]
    })

    const handleGenerateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        setFormData(prev => ({ ...prev, slug }))
    }

    const handleAddImage = () => {
        if (newImageUrl) {
            setImages([...images, newImageUrl])
            setNewImageUrl('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                images: images.map((url, index) => ({
                    imageUrl: url,
                    isPrimary: index === 0,
                    priority: index + 1
                }))
            }

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const error = await res.json()
                alert(error.error || 'Failed to create product')
                return
            }

            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
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
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        onBlur={handleGenerateSlug}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Slug</label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Base Price (₹)</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.basePrice}
                        onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
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
            </div>

            {/* Relations */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Categories & Colors</h3>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Categories</label>
                    <select
                        multiple
                        className="w-full p-2 border border-gray-300 rounded-md h-32"
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
                                                : prev.colorIds.filter(id => id !== color.id)
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
                            <Image src={url} alt={`Product ${idx}`} fill className="object-cover" />
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </button>
            </div>
        </form>
    )
}

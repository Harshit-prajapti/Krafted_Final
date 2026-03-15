'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

// Zod Schema
const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    type: z.enum(['PRODUCT_TYPE', 'ROOM', 'STYLE', 'CAMPAIGN']),
    parentIds: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true)
})

interface CategoryFormProps {
    categories: any[]
}

export default function CategoryForm({ categories }: CategoryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        type: 'PRODUCT_TYPE',
        parentIds: [] as string[],
        isActive: true
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => {
            const newData = { ...prev, [name]: value }

            // Auto-generate slug if name changes and slug wasn't manually edited (simplified check)
            if (name === 'name') {
                newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }
            return newData
        })
    }

    const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, parentIds: selectedOptions }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        // Validate
        const result = categorySchema.safeParse(formData)

        if (!result.success) {
            const newErrors: { [key: string]: string } = {}
            result.error.errors.forEach(err => {
                const path = err.path[0] as string
                newErrors[path] = err.message
            })
            setErrors(newErrors)
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/categories/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.data)
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 409) {
                    setErrors({ slug: "Category with this slug already exists" })
                } else {
                    throw new Error(data.error || 'Failed to create category')
                }
                return
            }

            // Reset form or redirect
            router.push('/admin/categories')
            router.refresh()
        } catch (err: any) {
            setErrors({ form: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            {errors.form && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {errors.form}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. Living Room"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. living-room"
                    />
                    {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                        <option value="PRODUCT_TYPE">Product Type</option>
                        <option value="ROOM">Room</option>
                        <option value="STYLE">Style</option>
                        <option value="CAMPAIGN">Campaign</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Parent Categories (Optional)</label>
                    <select
                        multiple
                        name="parentIds"
                        value={formData.parentIds}
                        onChange={handleParentChange}
                        className="flex h-32 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name} ({cat.type})
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple parents.</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <label
                    htmlFor="isActive"
                    className="text-sm font-medium leading-none cursor-pointer"
                >
                    Active (Visible in store)
                </label>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Creating...' : 'Create Category'}
                </button>
            </div>
        </form>
    )
}

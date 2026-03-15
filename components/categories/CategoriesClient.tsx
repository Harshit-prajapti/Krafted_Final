'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CategoryWithCover {
    id: string
    name: string
    slug: string
    _count: {
        products: number
        children: number
    }
    coverImage: string | null
}

interface CategoriesClientProps {
    initialCategories: CategoryWithCover[]
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
    const { data: categories } = useQuery({
        queryKey: ['categories', 'root'],
        queryFn: async () => {
            const res = await fetch('/api/categories?isActive=true&includeChildren=true')
            if (!res.ok) throw new Error('Failed to fetch categories')
            const data = await res.json()
            return data.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                _count: cat._count,
                coverImage: null
            })) as CategoryWithCover[]
        },
        initialData: initialCategories,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
    })

    const fallbackImage = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800'

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                    <Link
                        href={`/categories/${category.slug}`}
                        className="group relative block h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="absolute inset-0">
                            <img
                                src={category.coverImage || fallbackImage}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
                        </div>

                        <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                            <h2 className="text-3xl font-heading font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                {category.name}
                            </h2>

                            <div className="flex items-center gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                <p className="text-amber-300 font-medium">
                                    {category._count.products} Products
                                </p>
                                {category._count.children > 0 && (
                                    <>
                                        <span className="w-1 h-1 bg-white rounded-full" />
                                        <p className="text-gray-300">
                                            {category._count.children} Collections
                                        </p>
                                    </>
                                )}
                                <ArrowRight className="w-5 h-5 ml-auto text-amber-400 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}

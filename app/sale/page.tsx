import { prisma } from '@/lib/prisma'
import { Sparkles, Flame, Tag, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SalePage() {
    // Fetch CAMPAIGN type categories (sale/promotion categories)
    const campaignCategories = await prisma.category.findMany({
        where: {
            type: 'CAMPAIGN',
            isActive: true
        }
    })

    // Get products by joining through ProductCategory
    let saleProducts: Array<{
        id: string
        name: string
        slug: string
        basePrice: any
        campaignName: string
        imageUrl: string | null
        categoryName: string
    }> = []

    if (campaignCategories.length > 0) {
        const productCategories = await prisma.productCategory.findMany({
            where: {
                categoryId: { in: campaignCategories.map(c => c.id) }
            },
            include: {
                product: {
                    include: {
                        images: {
                            take: 1,
                            orderBy: { priority: 'asc' }
                        },
                        categories: {
                            include: { category: true },
                            take: 1
                        }
                    }
                },
                category: true
            },
            take: 24
        })

        saleProducts = productCategories
            .filter(pc => pc.product.isActive)
            .map(pc => ({
                id: pc.product.id,
                name: pc.product.name,
                slug: pc.product.slug,
                basePrice: pc.product.basePrice as any,
                campaignName: pc.category.name,
                imageUrl: pc.product.images[0]?.imageUrl || null,
                categoryName: pc.product.categories[0]?.category?.name || 'Furniture'
            }))
    }

    // If no campaign products, get latest products as fallback
    const latestProducts = saleProducts.length === 0
        ? await prisma.product.findMany({
            where: { isActive: true },
            include: {
                images: {
                    take: 1,
                    orderBy: { priority: 'asc' }
                },
                categories: {
                    include: { category: true },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 12
        })
        : []

    const isShowingLatest = saleProducts.length === 0

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Flame className="text-red-500 w-6 h-6" />
                        <span className="text-red-500 uppercase tracking-[0.2em] text-sm font-medium">
                            {isShowingLatest ? 'Featured' : 'Limited Time'}
                        </span>
                        <Flame className="text-red-500 w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                        {isShowingLatest ? 'Featured Collection' : 'Sale & Special Offers'}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {isShowingLatest
                            ? 'Explore our latest handcrafted furniture pieces.'
                            : 'Discover exceptional deals on our handcrafted furniture collection.'
                        }
                    </p>
                </div>

                {/* Sale Banner */}
                {!isShowingLatest && (
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 mb-12 text-white text-center">
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <Clock className="w-5 h-5" />
                            <span className="uppercase tracking-widest text-sm font-medium">Hurry! Limited Stock</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Special Offers</h2>
                        <p className="text-white/80">On selected premium furniture pieces</p>
                    </div>
                )}

                {/* Campaign Categories */}
                {campaignCategories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {campaignCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-amber-500 text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors"
                            >
                                <Sparkles className="w-4 h-4" />
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Products Grid */}
                {(saleProducts.length > 0 || latestProducts.length > 0) ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Sale Products */}
                        {saleProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.imageUrl || '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {product.campaignName}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                        {product.categoryName}
                                    </p>
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="text-lg font-bold text-gray-900">
                                        ₹{Number(product.basePrice).toLocaleString()}
                                    </span>
                                </div>
                            </Link>
                        ))}

                        {/* Latest Products (fallback) */}
                        {latestProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        New
                                    </span>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                        {product.categories[0]?.category?.name || 'Furniture'}
                                    </p>
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="text-lg font-bold text-gray-900">
                                        ₹{Number(product.basePrice).toLocaleString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sale Items Currently</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Check back soon for our next sale event, or explore our full collection.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Browse All Products
                        </Link>
                    </div>
                )}

                {/* Browse More */}
                {(saleProducts.length > 0 || latestProducts.length > 0) && (
                    <div className="text-center mt-12">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        >
                            View All Products
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

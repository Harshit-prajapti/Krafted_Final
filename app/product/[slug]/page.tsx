import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import type { Metadata } from 'next'

export const revalidate = 120 // ISR: revalidate every 2 minutes

interface Props {
    params: Promise<{ slug: string }>
}

// ── Dynamic SEO Metadata ──────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await prisma.product.findFirst({
        where: { slug, isActive: true },
        select: {
            name: true,
            description: true,
            basePrice: true,
            images: { take: 1, orderBy: { priority: 'asc' } },
        },
    })

    if (!product) {
        return { title: 'Product Not Found | Krafted Furniture' }
    }

    return {
        title: `${product.name} | Krafted Furniture`,
        description: product.description?.slice(0, 160) || `Shop ${product.name} at Krafted Furniture`,
        openGraph: {
            title: product.name,
            description: product.description?.slice(0, 160),
            images: product.images[0]?.imageUrl
                ? [{ url: product.images[0].imageUrl, width: 1200, height: 630 }]
                : [],
        },
    }
}

// ── Server Component ──────────────────────────────────────────────
export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params

    const product = await prisma.product.findFirst({
        where: { slug, isActive: true },
        include: {
            images: { orderBy: { priority: 'asc' } },
            variants: {
                where: { isActive: true },
                include: { color: true },
            },
            categories: {
                include: { category: true },
            },
            reviews: {
                select: { rating: true },
            },
        },
    })

    if (!product) {
        notFound()
    }

    // Calculate review stats server-side
    const totalReviews = product.reviews.length
    const averageRating =
        totalReviews > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0

    // Serialize for client component (convert Decimal → string, Date → ISO)
    const serializedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        basePrice: product.basePrice.toString(),
        material: product.material,
        dimensions: product.dimensions,
        weight: product.weight?.toString() ?? null,
        isActive: product.isActive,
        images: product.images.map(img => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
            priority: img.priority,
            isPrimary: img.isPrimary,
        })),
        variants: product.variants.map(v => ({
            id: v.id,
            sku: v.sku,
            price: v.price?.toString() ?? null,
            size: v.size,
            material: v.material,
            isActive: v.isActive,
            color: v.color
                ? { id: v.color.id, name: v.color.name, hexCode: v.color.hexCode }
                : null,
        })),
        categories: product.categories.map(c => ({
            category: {
                id: c.category.id,
                name: c.category.name,
                slug: c.category.slug,
                type: c.category.type,
            },
        })),
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
    }

    return <ProductDetailClient product={serializedProduct} />
}

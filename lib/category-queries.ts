import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

const categoryProductInclude = {
  images: { take: 1, orderBy: { priority: 'asc' as const } },
  categories: { include: { category: true } },
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude

type CategoryBranchProduct = Prisma.ProductGetPayload<{
  include: typeof categoryProductInclude
}>

export interface SerializedCategoryProduct {
  id: string
  name: string
  slug: string
  description: string
  material: string | null
  dimensions: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  basePrice: string
  vendorId: string | null
  weight: Prisma.Decimal | null
  images: Array<{ imageUrl: string; altText: string | null }>
  categories: Array<{ category: { name: string } }>
  averageRating: number
  totalReviews: number
}

export interface ChildCategorySummary {
  child: {
    id: string
    name: string
    slug: string
    _count: {
      products: number
    }
  }
}

export async function getCategoryBranchIds(categoryId: string) {
  const seen = new Set([categoryId])
  const branchIds = [categoryId]
  let frontier = [categoryId]

  while (frontier.length > 0) {
    const relations = await prisma.categoryRelation.findMany({
      where: { parentId: { in: frontier } },
      select: { childId: true },
    })

    const nextFrontier: string[] = []

    for (const relation of relations) {
      if (seen.has(relation.childId)) {
        continue
      }

      seen.add(relation.childId)
      branchIds.push(relation.childId)
      nextFrontier.push(relation.childId)
    }

    frontier = nextFrontier
  }

  return branchIds
}

function serializeCategoryProduct(product: CategoryBranchProduct): SerializedCategoryProduct {
  const reviews = product.reviews || []
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const { reviews: _reviews, ...productData } = product

  return {
    ...productData,
    basePrice: productData.basePrice.toString(),
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
  }
}

export async function getProductsForCategoryBranch({
  categoryId,
  page = 1,
  pageSize = 12,
}: {
  categoryId: string
  page?: number
  pageSize?: number
}) {
  const branchIds = await getCategoryBranchIds(categoryId)
  const skip = (page - 1) * pageSize

  const where = {
    isActive: true,
    categories: {
      some: {
        categoryId: { in: branchIds },
      },
    },
  } satisfies Prisma.ProductWhereInput

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
      include: categoryProductInclude,
    }),
    prisma.product.count({ where }),
  ])

  return {
    branchIds,
    total,
    products: products.map(serializeCategoryProduct),
  }
}

export async function getCategoryBranchSummary(categoryId: string) {
  const { branchIds, total } = await getProductsForCategoryBranch({
    categoryId,
    page: 1,
    pageSize: 1,
  })

  const coverProduct = await prisma.product.findFirst({
    where: {
      isActive: true,
      categories: {
        some: {
          categoryId: { in: branchIds },
        },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    select: {
      images: {
        take: 1,
        orderBy: { priority: 'asc' },
        select: { imageUrl: true },
      },
    },
  })

  return {
    total,
    coverImage: coverProduct?.images[0]?.imageUrl ?? null,
  }
}

export async function getImmediateChildCategorySummaries(parentId: string): Promise<ChildCategorySummary[]> {
  const childRelations = await prisma.categoryRelation.findMany({
    where: { parentId },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      child: {
        name: 'asc',
      },
    },
  })

  return Promise.all(
    childRelations.map(async ({ child }) => {
      const summary = await getCategoryBranchSummary(child.id)

      return {
        child: {
          ...child,
          _count: {
            products: summary.total,
          },
        },
      }
    })
  )
}

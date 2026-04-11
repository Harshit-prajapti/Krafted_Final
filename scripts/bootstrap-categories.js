require('dotenv').config({ path: '.env' })

const { PrismaClient, CategoryType } = require('@prisma/client')

const prisma = new PrismaClient()

const CATEGORY_DEFINITIONS = [
  {
    slug: 'living-room',
    name: 'Living Room',
    type: CategoryType.ROOM,
    parents: [],
    keywords: [
      'sofa',
      'couch',
      'settee',
      'armchair',
      'chair',
      'rocking chair',
      'chesterfield',
      'divan',
      'loveseat',
      'ottoman',
      'coffee table',
      'console',
    ],
  },
  {
    slug: 'bedroom',
    name: 'Bedroom',
    type: CategoryType.ROOM,
    parents: [],
    keywords: [
      'bed',
      'king bed',
      'queen bed',
      'poster bed',
      'hydraulic',
      'headboard',
      'bedside',
      'nightstand',
      'wardrobe',
      'dresser',
    ],
  },
  {
    slug: 'sofas',
    name: 'Sofas',
    type: CategoryType.PRODUCT_TYPE,
    parents: ['living-room'],
    keywords: ['sofa', 'couch', 'settee', 'chesterfield', 'sectional', 'loveseat', 'divan'],
  },
  {
    slug: 'beds',
    name: 'Beds',
    type: CategoryType.PRODUCT_TYPE,
    parents: ['bedroom'],
    keywords: ['bed', 'king bed', 'queen bed', 'poster bed', 'hydraulic storage', 'headboard'],
  },
  {
    slug: 'modern',
    name: 'Modern',
    type: CategoryType.STYLE,
    parents: [],
    keywords: ['modern', 'contemporary', 'minimal', 'sleek'],
  },
  {
    slug: 'vintage',
    name: 'Vintage',
    type: CategoryType.STYLE,
    parents: [],
    keywords: [
      'antique',
      'baroque',
      'classic',
      'french',
      'mughal',
      'carved',
      'persian',
      'opulent',
      'vintage',
      'royal',
      'chesterfield',
    ],
  },
]

const IMPLIED_PARENT_SLUGS = {
  sofas: ['living-room'],
  beds: ['bedroom'],
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function productHaystack(product) {
  return normalize([
    product.name,
    product.slug,
    product.description,
    product.material,
    product.dimensions,
  ].filter(Boolean).join(' '))
}

function matchesKeyword(haystack, keyword) {
  const normalizedKeyword = normalize(keyword)
  return normalizedKeyword.length > 0 && haystack.includes(normalizedKeyword)
}

async function upsertCategories() {
  const categoriesBySlug = new Map()

  for (const definition of CATEGORY_DEFINITIONS) {
    const category = await prisma.category.upsert({
      where: { slug: definition.slug },
      update: {
        name: definition.name,
        type: definition.type,
        isActive: true,
      },
      create: {
        name: definition.name,
        slug: definition.slug,
        type: definition.type,
        isActive: true,
      },
    })

    categoriesBySlug.set(definition.slug, category)
  }

  let relationCount = 0

  for (const definition of CATEGORY_DEFINITIONS) {
    const child = categoriesBySlug.get(definition.slug)

    for (const parentSlug of definition.parents) {
      const parent = categoriesBySlug.get(parentSlug)
      if (!parent || !child) continue

      await prisma.categoryRelation.upsert({
        where: {
          parentId_childId: {
            parentId: parent.id,
            childId: child.id,
          },
        },
        update: {},
        create: {
          parentId: parent.id,
          childId: child.id,
        },
      })

      relationCount += 1
    }
  }

  return { categoriesBySlug, relationCount }
}

async function syncProductCategories(categoriesBySlug) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      material: true,
      dimensions: true,
    },
  })

  let matchedProducts = 0
  let linksCreated = 0

  for (const product of products) {
    const haystack = productHaystack(product)
    const matchedSlugs = new Set()

    for (const definition of CATEGORY_DEFINITIONS) {
      if (definition.keywords.some((keyword) => matchesKeyword(haystack, keyword))) {
        matchedSlugs.add(definition.slug)

        for (const parentSlug of IMPLIED_PARENT_SLUGS[definition.slug] || []) {
          matchedSlugs.add(parentSlug)
        }
      }
    }

    if (matchedSlugs.size === 0) {
      continue
    }

    matchedProducts += 1

    const data = Array.from(matchedSlugs)
      .map((slug) => categoriesBySlug.get(slug))
      .filter(Boolean)
      .map((category) => ({
        productId: product.id,
        categoryId: category.id,
      }))

    if (data.length === 0) {
      continue
    }

    const result = await prisma.productCategory.createMany({
      data,
      skipDuplicates: true,
    })

    linksCreated += result.count
  }

  const totalLinks = await prisma.productCategory.count()

  return {
    productsChecked: products.length,
    matchedProducts,
    linksCreated,
    totalLinks,
  }
}

async function main() {
  const { categoriesBySlug, relationCount } = await upsertCategories()
  const productSync = await syncProductCategories(categoriesBySlug)
  const totalCategories = await prisma.category.count()

  console.log(`Categories ready: ${totalCategories}`)
  console.log(`Category relations ensured: ${relationCount}`)
  console.log(`Products checked: ${productSync.productsChecked}`)
  console.log(`Products matched: ${productSync.matchedProducts}`)
  console.log(`New product-category links: ${productSync.linksCreated}`)
  console.log(`Total product-category links: ${productSync.totalLinks}`)

  if (productSync.productsChecked > 0 && productSync.totalLinks === 0) {
    throw new Error('No product-category links were created. Review category keyword mapping before release.')
  }
}

main()
  .catch((error) => {
    console.error('Failed to bootstrap categories:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

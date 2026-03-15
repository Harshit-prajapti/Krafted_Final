import { z } from 'zod'

// Re-create the schema from api/products/route.ts
const productSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(10),
    basePrice: z.number().or(z.string().transform(v => parseFloat(v))),
    material: z.string().optional(),
    dimensions: z.string().optional(),
    isActive: z.boolean().default(true),
    categoryIds: z.array(z.string()).min(1, "At least one category is required"),
    colorIds: z.array(z.string()).optional().default([]),
    images: z.array(z.object({
        imageUrl: z.string().url(),
        altText: z.string().optional(),
        isPrimary: z.boolean().default(false),
        priority: z.number().default(5)
    })).optional()
})

describe('productSchema', () => {
    const validProduct = {
        name: 'Modern Chair',
        slug: 'modern-chair',
        description: 'A beautiful modern chair for your living room',
        basePrice: 4999,
        categoryIds: ['cat-1'],
    }

    it('passes with minimal valid input', () => {
        const result = productSchema.safeParse(validProduct)
        expect(result.success).toBe(true)
    })

    it('passes with all optional fields', () => {
        const result = productSchema.safeParse({
            ...validProduct,
            material: 'Wood',
            dimensions: '60x60x90cm',
            isActive: false,
            colorIds: ['clr-1', 'clr-2'],
            images: [{ imageUrl: 'https://example.com/img.jpg', altText: 'Chair' }]
        })
        expect(result.success).toBe(true)
    })

    it('coerces string basePrice to number', () => {
        const result = productSchema.safeParse({ ...validProduct, basePrice: '4999.50' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.basePrice).toBe(4999.5)
        }
    })

    it('defaults isActive to true', () => {
        const result = productSchema.safeParse(validProduct)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.isActive).toBe(true)
        }
    })

    it('defaults colorIds to empty array', () => {
        const result = productSchema.safeParse(validProduct)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.colorIds).toEqual([])
        }
    })

    it('fails when name is too short', () => {
        const result = productSchema.safeParse({ ...validProduct, name: 'A' })
        expect(result.success).toBe(false)
    })

    it('fails when slug is too short', () => {
        const result = productSchema.safeParse({ ...validProduct, slug: 'a' })
        expect(result.success).toBe(false)
    })

    it('fails when description is too short', () => {
        const result = productSchema.safeParse({ ...validProduct, description: 'Short' })
        expect(result.success).toBe(false)
    })

    it('fails when categoryIds is empty', () => {
        const result = productSchema.safeParse({ ...validProduct, categoryIds: [] })
        expect(result.success).toBe(false)
    })

    it('fails when categoryIds is missing', () => {
        const { categoryIds, ...rest } = validProduct
        const result = productSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it('fails when image URL is invalid', () => {
        const result = productSchema.safeParse({
            ...validProduct,
            images: [{ imageUrl: 'not-a-url' }]
        })
        expect(result.success).toBe(false)
    })
})

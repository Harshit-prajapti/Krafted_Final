import { z } from 'zod'

// Re-create the schema from api/cart/route.ts
const addToCartSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().min(1).default(1),
    selectedColor: z.object({
        id: z.string(),
        name: z.string(),
        hexCode: z.string()
    })
})

describe('addToCartSchema', () => {
    const validInput = {
        productId: 'prod-123',
        quantity: 2,
        selectedColor: {
            id: 'clr-1',
            name: 'Red',
            hexCode: '#FF0000'
        }
    }

    it('passes with valid input', () => {
        const result = addToCartSchema.safeParse(validInput)
        expect(result.success).toBe(true)
    })

    it('defaults quantity to 1 when not provided', () => {
        const { quantity, ...rest } = validInput
        const result = addToCartSchema.safeParse(rest)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.quantity).toBe(1)
        }
    })

    it('fails when productId is missing', () => {
        const { productId, ...rest } = validInput
        const result = addToCartSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it('fails when quantity is 0', () => {
        const result = addToCartSchema.safeParse({ ...validInput, quantity: 0 })
        expect(result.success).toBe(false)
    })

    it('fails when quantity is negative', () => {
        const result = addToCartSchema.safeParse({ ...validInput, quantity: -1 })
        expect(result.success).toBe(false)
    })

    it('fails when quantity is a float', () => {
        const result = addToCartSchema.safeParse({ ...validInput, quantity: 1.5 })
        expect(result.success).toBe(false)
    })

    it('fails when selectedColor is missing', () => {
        const { selectedColor, ...rest } = validInput
        const result = addToCartSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it('fails when selectedColor.id is missing', () => {
        const result = addToCartSchema.safeParse({
            ...validInput,
            selectedColor: { name: 'Red', hexCode: '#FF0000' }
        })
        expect(result.success).toBe(false)
    })

    it('fails when selectedColor.hexCode is missing', () => {
        const result = addToCartSchema.safeParse({
            ...validInput,
            selectedColor: { id: 'clr-1', name: 'Red' }
        })
        expect(result.success).toBe(false)
    })
})

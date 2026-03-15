import { z } from 'zod'

// Re-create the schema from api/auth/register/route.ts
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    fullName: z.string().min(2),
    phone: z.string().optional(),
})

describe('registerSchema', () => {
    const validInput = {
        email: 'user@example.com',
        password: 'securePass123',
        confirmPassword: 'securePass123',
        fullName: 'John Doe',
    }

    it('passes with valid input', () => {
        const result = registerSchema.safeParse(validInput)
        expect(result.success).toBe(true)
    })

    it('passes with optional phone number', () => {
        const result = registerSchema.safeParse({ ...validInput, phone: '+919876543210' })
        expect(result.success).toBe(true)
    })

    it('fails with invalid email', () => {
        const result = registerSchema.safeParse({ ...validInput, email: 'not-an-email' })
        expect(result.success).toBe(false)
    })

    it('fails with empty email', () => {
        const result = registerSchema.safeParse({ ...validInput, email: '' })
        expect(result.success).toBe(false)
    })

    it('fails with short password (< 6 chars)', () => {
        const result = registerSchema.safeParse({ ...validInput, password: '12345' })
        expect(result.success).toBe(false)
    })

    it('fails with short confirmPassword (< 6 chars)', () => {
        const result = registerSchema.safeParse({ ...validInput, confirmPassword: '123' })
        expect(result.success).toBe(false)
    })

    it('fails with short fullName (< 2 chars)', () => {
        const result = registerSchema.safeParse({ ...validInput, fullName: 'J' })
        expect(result.success).toBe(false)
    })

    it('fails when email is missing', () => {
        const { email, ...rest } = validInput
        const result = registerSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it('fails when password is missing', () => {
        const { password, ...rest } = validInput
        const result = registerSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it('fails when fullName is missing', () => {
        const { fullName, ...rest } = validInput
        const result = registerSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    // Note: password !== confirmPassword is checked in the route handler, not the schema
    it('schema passes even if passwords differ (matching is checked in handler)', () => {
        const result = registerSchema.safeParse({
            ...validInput,
            confirmPassword: 'differentPass123',
        })
        expect(result.success).toBe(true)
    })
})

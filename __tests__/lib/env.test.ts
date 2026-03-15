import { z } from 'zod'

// Re-create the schema here so we can test it without triggering env.parse
const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
    NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
})

describe('envSchema validation', () => {
    const validEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/krafted',
        NEXTAUTH_SECRET: 'super-secret-key',
        NEXTAUTH_URL: 'http://localhost:3000',
    }

    it('passes with all required fields', () => {
        const result = envSchema.safeParse(validEnv)
        expect(result.success).toBe(true)
    })

    it('passes when optional fields are omitted', () => {
        const result = envSchema.safeParse(validEnv)
        expect(result.success).toBe(true)
    })

    it('passes with optional fields included', () => {
        const result = envSchema.safeParse({
            ...validEnv,
            CLOUDINARY_CLOUD_NAME: 'my-cloud',
            RAZORPAY_KEY_ID: 'rzp_key',
        })
        expect(result.success).toBe(true)
    })

    it('fails when DATABASE_URL is missing', () => {
        const { DATABASE_URL, ...rest } = validEnv
        const result = envSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it('fails when DATABASE_URL is empty string', () => {
        const result = envSchema.safeParse({ ...validEnv, DATABASE_URL: '' })
        expect(result.success).toBe(false)
    })

    it('fails when NEXTAUTH_SECRET is missing', () => {
        const { NEXTAUTH_SECRET, ...rest } = validEnv
        const result = envSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it('fails when NEXTAUTH_URL is not a valid URL', () => {
        const result = envSchema.safeParse({ ...validEnv, NEXTAUTH_URL: 'not-a-url' })
        expect(result.success).toBe(false)
    })

    it('fails when NEXTAUTH_URL is missing', () => {
        const { NEXTAUTH_URL, ...rest } = validEnv
        const result = envSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })
})

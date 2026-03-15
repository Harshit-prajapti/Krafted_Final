/**
 * Auth Register API Route Handler Tests
 * Tests POST /api/auth/register
 */

// ── Mocks ─────────────────────────────────────────────────────────
const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}

jest.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}))

import { POST } from '@/app/api/auth/register/route'
import { NextRequest } from 'next/server'

function makeRequest(body: any): NextRequest {
    return new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

const validBody = {
    email: 'newuser@example.com',
    password: 'securePass123',
    confirmPassword: 'securePass123',
    fullName: 'John Doe',
}

beforeEach(() => jest.clearAllMocks())

describe('POST /api/auth/register', () => {
    it('returns 400 for invalid body (missing email)', async () => {
        const { email, ...rest } = validBody
        const res = await POST(makeRequest(rest))
        expect(res.status).toBe(400)
        const data = await res.json()
        expect(data.error).toBe('Validation Failed')
    })

    it('returns 400 for invalid email format', async () => {
        const res = await POST(makeRequest({ ...validBody, email: 'not-email' }))
        expect(res.status).toBe(400)
    })

    it('returns 400 for short password', async () => {
        const res = await POST(makeRequest({ ...validBody, password: '123' }))
        expect(res.status).toBe(400)
    })

    it('returns 400 when passwords do not match', async () => {
        const res = await POST(makeRequest({
            ...validBody,
            confirmPassword: 'differentPass123',
        }))
        expect(res.status).toBe(400)
        const data = await res.json()
        expect(data.error).toBe('Passwords do not match')
    })

    it('returns 409 when user already exists', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'newuser@example.com' })

        const res = await POST(makeRequest(validBody))
        expect(res.status).toBe(409)
        const data = await res.json()
        expect(data.error).toContain('already exists')
    })

    it('returns 201 and creates user on success', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null)
        mockPrisma.user.create.mockResolvedValue({
            id: 'new-user-id',
            email: 'newuser@example.com',
            name: 'John Doe',
            role: 'USER',
            createdAt: new Date().toISOString(),
        })

        const res = await POST(makeRequest(validBody))
        expect(res.status).toBe(201)
        const data = await res.json()
        expect(data.email).toBe('newuser@example.com')
        expect(data.role).toBe('USER')
    })

    it('accepts optional phone field', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null)
        mockPrisma.user.create.mockResolvedValue({
            id: 'new-user-id',
            email: 'newuser@example.com',
            name: 'John Doe',
            role: 'USER',
            createdAt: new Date().toISOString(),
        })

        const res = await POST(makeRequest({ ...validBody, phone: '+919876543210' }))
        expect(res.status).toBe(201)
    })

    it('returns 500 on unexpected error', async () => {
        mockPrisma.user.findUnique.mockRejectedValue(new Error('DB connection lost'))
        const res = await POST(makeRequest(validBody))
        expect(res.status).toBe(500)
    })
})

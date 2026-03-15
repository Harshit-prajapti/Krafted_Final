/**
 * Wishlist API Route Handler Tests
 * Tests GET / POST on /api/wishlist
 */

// ── Mocks ─────────────────────────────────────────────────────────
const mockGetServerSession = jest.fn()
const mockPrisma = {
    wishlistItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    product: {
        findUnique: jest.fn(),
    },
}

jest.mock('next-auth', () => ({
    getServerSession: (...args: any[]) => mockGetServerSession(...args),
}))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

import { GET, POST } from '@/app/api/wishlist/route'
import { NextRequest } from 'next/server'

function makeRequest(method: string, body?: any): NextRequest {
    const url = 'http://localhost:3000/api/wishlist'
    const init: RequestInit = { method }
    if (body) {
        init.body = JSON.stringify(body)
        init.headers = { 'Content-Type': 'application/json' }
    }
    return new NextRequest(url, init)
}

const mockSession = { user: { id: 'user-1', role: 'USER', email: 'a@b.com', name: 'Test' } }

beforeEach(() => jest.clearAllMocks())

// ── GET Tests ─────────────────────────────────────────────────────
describe('GET /api/wishlist', () => {
    it('returns empty array when unauthenticated (not 401)', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await GET(makeRequest('GET'))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data).toEqual([])
    })

    it('returns transformed wishlist items for authenticated user', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.wishlistItem.findMany.mockResolvedValue([
            {
                id: 'wi-1',
                userId: 'user-1',
                productId: 'p1',
                product: {
                    id: 'p1',
                    name: 'Chair',
                    slug: 'chair',
                    basePrice: 1500,
                    images: [{ imageUrl: 'https://img.com/1.jpg', altText: 'Chair' }],
                    categories: []
                }
            }
        ])

        const res = await GET(makeRequest('GET'))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data).toHaveLength(1)
        expect(data[0].product.price).toBe(1500)
        expect(data[0].product.images[0].url).toBe('https://img.com/1.jpg')
    })

    it('returns empty array on error (graceful fallback)', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.wishlistItem.findMany.mockRejectedValue(new Error('DB error'))

        const res = await GET(makeRequest('GET'))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data).toEqual([])
    })
})

// ── POST Tests ────────────────────────────────────────────────────
describe('POST /api/wishlist', () => {
    it('returns 401 when unauthenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await POST(makeRequest('POST', { productId: 'p1' }))
        expect(res.status).toBe(401)
    })

    it('returns 400 for invalid body', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        const res = await POST(makeRequest('POST', {}))
        expect(res.status).toBe(400)
    })

    it('returns 404 when product not found', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.product.findUnique.mockResolvedValue(null)

        const res = await POST(makeRequest('POST', { productId: 'nonexistent' }))
        expect(res.status).toBe(404)
    })

    it('returns 200 if item already in wishlist (idempotent)', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1' })
        mockPrisma.wishlistItem.findUnique.mockResolvedValue({ id: 'wi-existing' })

        const res = await POST(makeRequest('POST', { productId: 'p1' }))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data.message).toContain('already')
    })

    it('creates wishlist item and returns 201', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1' })
        mockPrisma.wishlistItem.findUnique.mockResolvedValue(null)
        mockPrisma.wishlistItem.create.mockResolvedValue({
            id: 'wi-new',
            userId: 'user-1',
            productId: 'p1',
            product: { id: 'p1', images: [] }
        })

        const res = await POST(makeRequest('POST', { productId: 'p1' }))
        const data = await res.json()
        expect(res.status).toBe(201)
        expect(data.success).toBe(true)
    })
})

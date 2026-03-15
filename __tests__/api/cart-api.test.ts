/**
 * Cart API Route Handler Tests
 * Tests GET / POST / PATCH / DELETE on /api/cart
 */

// ── Mocks ─────────────────────────────────────────────────────────
const mockGetServerSession = jest.fn()
const mockPrisma = {
    cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    cartItem: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    productVariant: {
        findFirst: jest.fn(),
    },
}

jest.mock('next-auth', () => ({
    getServerSession: (...args: any[]) => mockGetServerSession(...args),
}))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

import { GET, POST, PATCH, DELETE } from '@/app/api/cart/route'
import { NextRequest } from 'next/server'

// ── Helpers ───────────────────────────────────────────────────────
function makeRequest(method: string, body?: any): NextRequest {
    const url = 'http://localhost:3000/api/cart'
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
describe('GET /api/cart', () => {
    it('returns 401 when unauthenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await GET(makeRequest('GET'))
        expect(res.status).toBe(401)
    })

    it('returns empty cart structure when no cart exists', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue(null)

        const res = await GET(makeRequest('GET'))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data.items).toEqual([])
        expect(data.subtotal).toBe(0)
        expect(data.itemCount).toBe(0)
    })

    it('returns cart with calculated subtotal and itemCount', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue({
            id: 'cart-1',
            userId: 'user-1',
            items: [
                {
                    id: 'item-1',
                    quantity: 2,
                    product: { id: 'p1', basePrice: 1000, images: [] },
                    variant: { price: 1200, color: null }
                },
                {
                    id: 'item-2',
                    quantity: 1,
                    product: { id: 'p2', basePrice: 500, images: [] },
                    variant: null
                }
            ]
        })

        const res = await GET(makeRequest('GET'))
        const data = await res.json()
        expect(res.status).toBe(200)
        // 2 * 1200 (variant price) + 1 * 500 (base price) = 2900
        expect(data.subtotal).toBe(2900)
        expect(data.itemCount).toBe(3)
    })
})

// ── POST Tests ────────────────────────────────────────────────────
describe('POST /api/cart', () => {
    const validBody = {
        productId: 'prod-1',
        quantity: 1,
        selectedColor: { id: 'clr-1', name: 'Red', hexCode: '#FF0000' }
    }

    it('returns 401 when unauthenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await POST(makeRequest('POST', validBody))
        expect(res.status).toBe(401)
    })

    it('returns 400 for invalid body', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        const res = await POST(makeRequest('POST', { quantity: -1 }))
        expect(res.status).toBe(400)
    })

    it('returns 404 when variant not found for the color', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart-1', userId: 'user-1' })
        mockPrisma.productVariant.findFirst.mockResolvedValue(null)

        const res = await POST(makeRequest('POST', validBody))
        expect(res.status).toBe(404)
    })

    it('creates a new cart item when none exists', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart-1', userId: 'user-1' })
        mockPrisma.productVariant.findFirst.mockResolvedValue({ id: 'var-1' })
        mockPrisma.cartItem.findFirst.mockResolvedValue(null)
        mockPrisma.cartItem.create.mockResolvedValue({ id: 'ci-new', quantity: 1 })

        const res = await POST(makeRequest('POST', validBody))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data.id).toBe('ci-new')
        expect(mockPrisma.cartItem.create).toHaveBeenCalled()
    })

    it('increments quantity for existing item', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart-1', userId: 'user-1' })
        mockPrisma.productVariant.findFirst.mockResolvedValue({ id: 'var-1' })
        mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 'ci-1', quantity: 2 })
        mockPrisma.cartItem.update.mockResolvedValue({ id: 'ci-1', quantity: 3 })

        const res = await POST(makeRequest('POST', validBody))
        const data = await res.json()
        expect(data.quantity).toBe(3)
        expect(mockPrisma.cartItem.update).toHaveBeenCalledWith(
            expect.objectContaining({ data: { quantity: 3 } })
        )
    })

    it('creates cart if user has none', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue(null)
        mockPrisma.cart.create.mockResolvedValue({ id: 'new-cart', userId: 'user-1' })
        mockPrisma.productVariant.findFirst.mockResolvedValue({ id: 'var-1' })
        mockPrisma.cartItem.findFirst.mockResolvedValue(null)
        mockPrisma.cartItem.create.mockResolvedValue({ id: 'ci-new', quantity: 1 })

        const res = await POST(makeRequest('POST', validBody))
        expect(res.status).toBe(200)
        expect(mockPrisma.cart.create).toHaveBeenCalled()
    })
})

// ── PATCH Tests ───────────────────────────────────────────────────
describe('PATCH /api/cart', () => {
    it('returns 401 when unauthenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await PATCH(makeRequest('PATCH', { itemId: 'ci-1', quantity: 5 }))
        expect(res.status).toBe(401)
    })

    it('returns 400 for invalid data (missing quantity)', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        const res = await PATCH(makeRequest('PATCH', { itemId: 'ci-1' }))
        expect(res.status).toBe(400)
    })

    it('returns 400 for quantity < 1', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        const res = await PATCH(makeRequest('PATCH', { itemId: 'ci-1', quantity: 0 }))
        expect(res.status).toBe(400)
    })

    it('returns 404 when cart item not found', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cartItem.findUnique.mockResolvedValue(null)
        const res = await PATCH(makeRequest('PATCH', { itemId: 'ci-999', quantity: 2 }))
        expect(res.status).toBe(404)
    })

    it('returns 403 when item belongs to another user', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cartItem.findUnique.mockResolvedValue({
            id: 'ci-1',
            cart: { userId: 'other-user' }
        })
        const res = await PATCH(makeRequest('PATCH', { itemId: 'ci-1', quantity: 2 }))
        expect(res.status).toBe(403)
    })

    it('updates quantity successfully', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cartItem.findUnique.mockResolvedValue({
            id: 'ci-1',
            cart: { userId: 'user-1' }
        })
        mockPrisma.cartItem.update.mockResolvedValue({ id: 'ci-1', quantity: 5 })

        const res = await PATCH(makeRequest('PATCH', { itemId: 'ci-1', quantity: 5 }))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data.quantity).toBe(5)
    })
})

// ── DELETE Tests ──────────────────────────────────────────────────
describe('DELETE /api/cart', () => {
    it('returns 401 when unauthenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await DELETE(makeRequest('DELETE', { itemId: 'ci-1' }))
        expect(res.status).toBe(401)
    })

    it('returns 400 when itemId is missing', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        const res = await DELETE(makeRequest('DELETE', {}))
        expect(res.status).toBe(400)
    })

    it('returns 404 when item not found', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cartItem.findUnique.mockResolvedValue(null)
        const res = await DELETE(makeRequest('DELETE', { itemId: 'ci-999' }))
        expect(res.status).toBe(404)
    })

    it('returns 403 when item belongs to another user', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cartItem.findUnique.mockResolvedValue({
            id: 'ci-1',
            cart: { userId: 'other-user' }
        })
        const res = await DELETE(makeRequest('DELETE', { itemId: 'ci-1' }))
        expect(res.status).toBe(403)
    })

    it('deletes item successfully', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cartItem.findUnique.mockResolvedValue({
            id: 'ci-1',
            cart: { userId: 'user-1' }
        })
        mockPrisma.cartItem.delete.mockResolvedValue({})

        const res = await DELETE(makeRequest('DELETE', { itemId: 'ci-1' }))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data.success).toBe(true)
    })
})

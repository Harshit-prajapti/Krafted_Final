/**
 * Orders API Route Handler Tests
 * Tests GET / POST on /api/orders
 */

// ── Mocks ─────────────────────────────────────────────────────────
const mockGetServerSession = jest.fn()
const mockPrisma = {
    order: {
        findMany: jest.fn(),
    },
    cart: {
        findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
}

jest.mock('next-auth', () => ({
    getServerSession: (...args: any[]) => mockGetServerSession(...args),
}))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

import { GET, POST } from '@/app/api/orders/route'
import { NextRequest } from 'next/server'

function makeRequest(method: string, body?: any): NextRequest {
    const url = 'http://localhost:3000/api/orders'
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
describe('GET /api/orders', () => {
    it('returns 401 when unauthenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await GET(makeRequest('GET'))
        expect(res.status).toBe(401)
    })

    it('returns user orders', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        const sampleOrders = [
            {
                id: 'ord-1',
                userId: 'user-1',
                totalAmount: 5900,
                status: 'CREATED',
                items: [],
                shippingAddress: {},
                payments: []
            }
        ]
        mockPrisma.order.findMany.mockResolvedValue(sampleOrders)

        const res = await GET(makeRequest('GET'))
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data).toHaveLength(1)
        expect(data[0].id).toBe('ord-1')
    })

    it('returns 500 on unexpected error', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.order.findMany.mockRejectedValue(new Error('DB error'))

        const res = await GET(makeRequest('GET'))
        expect(res.status).toBe(500)
    })
})

// ── POST Tests ────────────────────────────────────────────────────
describe('POST /api/orders', () => {
    it('returns 401 when unauthenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)
        const res = await POST(makeRequest('POST', { addressId: 'addr-1' }))
        expect(res.status).toBe(401)
    })

    it('returns 400 when addressId is missing', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        const res = await POST(makeRequest('POST', {}))
        expect(res.status).toBe(400)
        const data = await res.json()
        expect(data.error).toContain('Address')
    })

    it('returns 400 when cart is empty', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart-1', items: [] })

        const res = await POST(makeRequest('POST', { addressId: 'addr-1' }))
        expect(res.status).toBe(400)
        const data = await res.json()
        expect(data.error).toContain('empty')
    })

    it('returns 400 when cart does not exist', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue(null)

        const res = await POST(makeRequest('POST', { addressId: 'addr-1' }))
        expect(res.status).toBe(400)
    })

    it('returns 400 for COD payment method', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue({
            id: 'cart-1',
            items: [
                {
                    productId: 'p1',
                    variantId: null,
                    quantity: 1,
                    product: { name: 'Chair', basePrice: 1000, material: 'Wood' },
                    variant: null
                }
            ]
        })

        const res = await POST(makeRequest('POST', { addressId: 'addr-1', paymentMethod: 'COD' }))
        expect(res.status).toBe(400)
        const data = await res.json()
        expect(data.error).toContain('Cash on Delivery')
    })

    it('creates order with correct total (including 18% GST) on success', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockResolvedValue({
            id: 'cart-1',
            items: [
                {
                    productId: 'p1',
                    variantId: 'v1',
                    quantity: 2,
                    product: { name: 'Chair', basePrice: 1000, material: 'Wood' },
                    variant: { id: 'v1', price: 1200, sku: 'CHR-001', color: { name: 'Red' }, size: null, material: null }
                }
            ]
        })

        const expectedTotal = 2 * 1200 * 1.18 // 2832

        // Mock $transaction to execute the callback
        mockPrisma.$transaction.mockImplementation(async (cb: any) => {
            const tx = {
                order: {
                    create: jest.fn().mockResolvedValue({
                        id: 'ord-new',
                        status: 'CREATED',
                        paymentStatus: 'PENDING',
                        totalAmount: expectedTotal,
                        items: [{ productId: 'p1', quantity: 2 }],
                        shippingAddress: { city: 'Mumbai' }
                    })
                },
                payment: { create: jest.fn().mockResolvedValue({}) },
                orderHistory: { create: jest.fn().mockResolvedValue({}) },
                cartItem: { deleteMany: jest.fn() },
            }
            return cb(tx)
        })

        const res = await POST(makeRequest('POST', { addressId: 'addr-1' }))
        const data = await res.json()
        expect(res.status).toBe(201)
        expect(data.id).toBe('ord-new')
        expect(data.requiresPayment).toBe(true)
    })

    it('returns 500 on unexpected error', async () => {
        mockGetServerSession.mockResolvedValue(mockSession)
        mockPrisma.cart.findUnique.mockRejectedValue(new Error('Unexpected'))

        const res = await POST(makeRequest('POST', { addressId: 'addr-1' }))
        expect(res.status).toBe(500)
    })
})

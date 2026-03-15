/**
 * Categories API Route Handler Tests
 * Tests GET on /api/categories
 */

// ── Mocks ─────────────────────────────────────────────────────────
const mockPrisma = {
    category: {
        findMany: jest.fn(),
    },
}

jest.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))

import { GET } from '@/app/api/categories/route'
import { NextRequest } from 'next/server'

function makeRequest(params: Record<string, string> = {}): NextRequest {
    const url = new URL('http://localhost:3000/api/categories')
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return new NextRequest(url)
}

beforeEach(() => jest.clearAllMocks())

describe('GET /api/categories', () => {
    it('returns all categories by default', async () => {
        const sampleCategories = [
            { id: 'cat-1', name: 'Living Room', type: 'ROOM', _count: { products: 5 } },
            { id: 'cat-2', name: 'Chairs', type: 'PRODUCT_TYPE', _count: { products: 12 } }
        ]
        mockPrisma.category.findMany.mockResolvedValue(sampleCategories)

        const res = await GET(makeRequest())
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data).toHaveLength(2)
    })

    it('filters by type when passed', async () => {
        mockPrisma.category.findMany.mockResolvedValue([])

        await GET(makeRequest({ type: 'ROOM' }))

        expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ type: 'ROOM' }),
            })
        )
    })

    it('filters by isActive', async () => {
        mockPrisma.category.findMany.mockResolvedValue([])

        await GET(makeRequest({ isActive: 'true' }))

        expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ isActive: true }),
            })
        )
    })

    it('includes children when requested', async () => {
        mockPrisma.category.findMany.mockResolvedValue([])

        await GET(makeRequest({ includeChildren: 'true' }))

        expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                include: expect.objectContaining({ children: true }),
            })
        )
    })

    it('does not include children by default', async () => {
        mockPrisma.category.findMany.mockResolvedValue([])

        await GET(makeRequest())

        expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                include: expect.objectContaining({ children: false }),
            })
        )
    })

    it('returns 500 on error', async () => {
        mockPrisma.category.findMany.mockRejectedValue(new Error('DB error'))

        const res = await GET(makeRequest())
        expect(res.status).toBe(500)
    })
})

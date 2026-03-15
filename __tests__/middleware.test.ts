/**
 * Middleware Tests
 * Tests admin route protection in middleware.ts
 */

// ── Mocks ─────────────────────────────────────────────────────────
const mockGetToken = jest.fn()

jest.mock('next-auth/jwt', () => ({
    getToken: (...args: any[]) => mockGetToken(...args),
}))

// We need to mock NextResponse properly for redirect checks
import { middleware, config } from '@/middleware'
import { NextRequest, NextResponse } from 'next/server'

function makeRequest(pathname: string): NextRequest {
    return new NextRequest(new URL(pathname, 'http://localhost:3000'))
}

beforeEach(() => jest.clearAllMocks())

describe('middleware', () => {
    it('matches only /admin paths', () => {
        expect(config.matcher).toEqual(['/admin/:path*'])
    })

    it('allows non-admin paths through', async () => {
        mockGetToken.mockResolvedValue(null)
        const res = await middleware(makeRequest('/shop'))
        // NextResponse.next() has no redirect
        expect(res.headers.get('Location')).toBeNull()
    })

    it('redirects unauthenticated users from /admin to /auth/signin', async () => {
        mockGetToken.mockResolvedValue(null)
        const res = await middleware(makeRequest('/admin/dashboard'))
        const location = res.headers.get('Location')
        expect(location).toContain('/auth/signin')
    })

    it('redirects non-admin users from /admin to /', async () => {
        mockGetToken.mockResolvedValue({ id: 'user-1', role: 'USER' })
        const res = await middleware(makeRequest('/admin/products'))
        const location = res.headers.get('Location')
        expect(location).toBe('http://localhost:3000/')
    })

    it('allows admin users through to /admin paths', async () => {
        mockGetToken.mockResolvedValue({ id: 'admin-1', role: 'ADMIN' })
        const res = await middleware(makeRequest('/admin/products'))
        // Should proceed (no redirect location)
        expect(res.headers.get('Location')).toBeNull()
    })

    it('allows admin access to nested /admin paths', async () => {
        mockGetToken.mockResolvedValue({ id: 'admin-1', role: 'ADMIN' })
        const res = await middleware(makeRequest('/admin/orders/ord-123'))
        expect(res.headers.get('Location')).toBeNull()
    })
})

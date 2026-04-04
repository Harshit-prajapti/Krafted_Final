import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/signin', request.url))
        }

        if (token.role !== 'ADMIN') {
            console.log("I was called");
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Protect user routes
    const protectedUserRoutes = ['/cart', '/wishlist', '/profile']
    if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            const loginUrl = new URL('/user/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/cart/:path*', '/wishlist/:path*', '/profile/:path*'],
}

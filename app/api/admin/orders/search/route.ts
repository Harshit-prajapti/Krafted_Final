import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = request.nextUrl
        const query = searchParams.get('q')

        if (!query || query.length < 3) {
            return NextResponse.json({ orders: [] })
        }

        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { id: { contains: query, mode: 'insensitive' } },
                    { user: { name: { contains: query, mode: 'insensitive' } } },
                    { user: { email: { contains: query, mode: 'insensitive' } } }
                ]
            },
            take: 10,
            include: {
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ orders })

    } catch (error) {
        console.error('[ADMIN_ORDERS_SEARCH_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

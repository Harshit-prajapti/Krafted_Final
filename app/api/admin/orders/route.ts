import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = request.nextUrl
        const status = searchParams.get('status')
        const paymentStatus = searchParams.get('paymentStatus')
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = searchParams.get('sortOrder') || 'desc'
        const dateFrom = searchParams.get('dateFrom')
        const dateTo = searchParams.get('dateTo')
        const userId = searchParams.get('userId')
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '20')

        const where: Prisma.OrderWhereInput = {}
        if (status) where.status = status as any
        if (paymentStatus) where.paymentStatus = paymentStatus as any
        if (userId) where.userId = userId

        if (dateFrom || dateTo) {
            where.createdAt = {}
            if (dateFrom) where.createdAt.gte = new Date(dateFrom)
            if (dateTo) where.createdAt.lte = new Date(dateTo + 'T23:59:59')
        }

        const skip = (page - 1) * pageSize

        const orderByField = ['createdAt', 'totalAmount', 'status'].includes(sortBy) ? sortBy : 'createdAt'
        const orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc'

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    user: { select: { name: true, email: true, phone: true } },
                    shippingAddress: true,
                    items: true,
                    payments: {
                        select: { id: true, status: true, transactionId: true, provider: true },
                        take: 1,
                        orderBy: { createdAt: 'desc' }
                    },
                    shipping: { select: { trackingNumber: true, carrier: true, status: true } },
                    _count: { select: { items: true } }
                },
                orderBy: { [orderByField]: orderByDirection }
            }),
            prisma.order.count({ where })
        ])

        return NextResponse.json({
            data: orders,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        })

    } catch (error) {
        console.error('[ADMIN_ORDERS_GET_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

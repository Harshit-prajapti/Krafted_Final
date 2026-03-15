import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = request.nextUrl
        const period = parseInt(searchParams.get('period') || '30')

        const now = new Date()
        const startDate = new Date(now.getTime() - period * 24 * 60 * 60 * 1000)

        const [
            paidOrders,
            allOrders,
            newUsers,
            ordersByStatus,
            topProductsData
        ] = await Promise.all([
            prisma.order.findMany({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: startDate }
                },
                select: { totalAmount: true, createdAt: true }
            }),
            prisma.order.findMany({
                where: { createdAt: { gte: startDate } },
                select: { status: true, createdAt: true }
            }),
            prisma.user.findMany({
                where: { createdAt: { gte: startDate } },
                select: { createdAt: true }
            }),
            prisma.order.groupBy({
                by: ['status'],
                where: { createdAt: { gte: startDate } },
                _count: { status: true }
            }),
            prisma.orderItem.groupBy({
                by: ['productName'],
                where: {
                    order: {
                        paymentStatus: 'PAID',
                        createdAt: { gte: startDate }
                    }
                },
                _sum: { quantity: true, price: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            })
        ])

        const revenueByDate: Record<string, number> = {}
        const usersByDate: Record<string, number> = {}

        for (let i = 0; i < Math.min(period, 14); i++) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            revenueByDate[key] = 0
            usersByDate[key] = 0
        }

        paidOrders.forEach(order => {
            const key = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            if (revenueByDate[key] !== undefined) {
                revenueByDate[key] += Number(order.totalAmount)
            }
        })

        newUsers.forEach(user => {
            const key = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            if (usersByDate[key] !== undefined) {
                usersByDate[key]++
            }
        })

        const revenueData = Object.entries(revenueByDate)
            .map(([date, revenue]) => ({ date, revenue }))
            .reverse()

        const customerTrends = Object.entries(usersByDate)
            .map(([date, newUsers]) => ({ date, newUsers }))
            .reverse()

        const statusLabels: Record<string, string> = {
            CREATED: 'Created',
            CONFIRMED: 'Confirmed',
            SHIPPED: 'Shipped',
            DELIVERED: 'Delivered',
            CANCELLED: 'Cancelled'
        }

        const ordersByStatusFormatted = ordersByStatus.map(s => ({
            name: statusLabels[s.status] || s.status,
            value: s._count.status
        }))

        const topProducts = topProductsData.map(p => ({
            name: p.productName,
            sold: p._sum.quantity || 0,
            revenue: Number(p._sum.price || 0)
        }))

        const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
        const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

        return NextResponse.json({
            revenueData,
            ordersByStatus: ordersByStatusFormatted,
            topProducts,
            customerTrends,
            summary: {
                totalRevenue,
                totalOrders: allOrders.length,
                newCustomers: newUsers.length,
                avgOrderValue: Math.round(avgOrderValue)
            }
        })

    } catch (error) {
        console.error('[ADMIN_REPORTS_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

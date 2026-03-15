import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

        const [
            totalRevenue,
            previousRevenue,
            totalOrders,
            previousOrders,
            totalUsers,
            previousUsers,
            totalProducts
        ] = await Promise.all([
            prisma.order.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: thirtyDaysAgo }
                },
                _sum: { totalAmount: true }
            }),
            prisma.order.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
                },
                _sum: { totalAmount: true }
            }),
            prisma.order.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            prisma.order.count({
                where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
            }),
            prisma.user.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            prisma.user.count({
                where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
            }),
            prisma.product.count({ where: { isActive: true } })
        ])

        const calcChange = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0
            return Math.round(((current - previous) / previous) * 100 * 10) / 10
        }

        const currentRev = Number(totalRevenue._sum.totalAmount || 0)
        const prevRev = Number(previousRevenue._sum.totalAmount || 0)

        return NextResponse.json({
            revenue: {
                value: currentRev,
                change: calcChange(currentRev, prevRev)
            },
            orders: {
                value: totalOrders,
                change: calcChange(totalOrders, previousOrders)
            },
            users: {
                value: totalUsers,
                change: calcChange(totalUsers, previousUsers)
            },
            products: {
                value: totalProducts,
                change: 0
            }
        })

    } catch (error) {
        console.error('[ADMIN_STATS_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

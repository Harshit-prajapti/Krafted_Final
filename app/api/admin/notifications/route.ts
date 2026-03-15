import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // 1. Recent Failures (Alerts)
        const failedPayments = await prisma.payment.findMany({
            where: {
                status: 'FAILED',
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            },
            include: {
                order: {
                    select: {
                        id: true,
                        user: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        // 2. Recent Successes (Notifications)
        const newOrders = await prisma.order.findMany({
            where: {
                status: 'CREATED',
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        // Low Stock Notifications (Example logic)
        // const lowStockProducts = await prisma.product.findMany({ ... })

        const alerts = failedPayments.map(p => ({
            id: p.id,
            type: 'error',
            message: `Payment failed for Order #${p.order.id.slice(-6)} (${p.order.user.name})`,
            time: p.createdAt.toISOString()
        }))

        const notifications = newOrders.map(o => ({
            id: o.id,
            type: 'success',
            message: `New order #${o.id.slice(-6)} from ${o.user.name}`,
            time: o.createdAt.toISOString()
        }))

        return NextResponse.json({
            alerts,
            notifications
        })

    } catch (error) {
        console.error('[ADMIN_NOTIFICATIONS_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

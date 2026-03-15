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

        const failedPayments = await prisma.payment.findMany({
            where: {
                status: 'FAILED'
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                order: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        })

        const result = failedPayments.map(payment => ({
            id: payment.id,
            orderId: payment.orderId,
            amount: Number(payment.amount),
            provider: payment.provider,
            customerName: payment.order.user.name,
            customerEmail: payment.order.user.email,
            createdAt: payment.createdAt
        }))

        const totalFailed = await prisma.payment.count({
            where: { status: 'FAILED' }
        })

        return NextResponse.json({
            payments: result,
            total: totalFailed
        })

    } catch (error) {
        console.error('[ADMIN_FAILED_PAYMENTS_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

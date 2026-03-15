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
        const range = searchParams.get('range') || '7days'

        let days = 7
        if (range === '30days') days = 30
        else if (range === 'year') days = 365

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        startDate.setHours(0, 0, 0, 0)

        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                paymentStatus: 'PAID'
            },
            select: {
                createdAt: true,
                totalAmount: true
            },
            orderBy: { createdAt: 'asc' }
        })

        const dailyData: Record<string, { sales: number; revenue: number }> = {}

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate)
            date.setDate(startDate.getDate() + i)

            let key: string
            if (days <= 7) {
                key = dayNames[date.getDay()]
            } else if (days <= 30) {
                key = `${date.getDate()} ${monthNames[date.getMonth()]}`
            } else {
                key = monthNames[date.getMonth()]
            }

            if (!dailyData[key]) {
                dailyData[key] = { sales: 0, revenue: 0 }
            }
        }

        orders.forEach(order => {
            const date = new Date(order.createdAt)
            let key: string
            if (days <= 7) {
                key = dayNames[date.getDay()]
            } else if (days <= 30) {
                key = `${date.getDate()} ${monthNames[date.getMonth()]}`
            } else {
                key = monthNames[date.getMonth()]
            }

            if (dailyData[key]) {
                dailyData[key].sales += 1
                dailyData[key].revenue += Number(order.totalAmount)
            }
        })

        const chartData = Object.entries(dailyData).map(([name, data]) => ({
            name,
            sales: data.sales,
            revenue: data.revenue
        }))

        return NextResponse.json(chartData)

    } catch (error) {
        console.error('[ADMIN_SALES_CHART_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

import React from 'react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StatCard from '@/components/admin/dashboard/StatCard'
import SalesChart from '@/components/admin/dashboard/SalesChart'
import RecentOrdersTable from '@/components/admin/dashboard/RecentOrdersTable'
import TopCategoriesWidget from '@/components/admin/dashboard/TopCategoriesWidget'
import PaymentFailuresWidget from '@/components/admin/dashboard/PaymentFailuresWidget'

export const dynamic = 'force-dynamic'

async function getStats() {
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
        prisma.user.count(),
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

    return {
        revenue: { value: currentRev, change: calcChange(currentRev, prevRev) },
        orders: { value: totalOrders, change: calcChange(totalOrders, previousOrders) },
        users: { value: totalUsers, change: calcChange(totalUsers, previousUsers) },
        products: { value: totalProducts, change: 0 }
    }
}

async function getSalesData() {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    startDate.setHours(0, 0, 0, 0)

    const orders = await prisma.order.findMany({
        where: {
            createdAt: { gte: startDate },
            paymentStatus: 'PAID'
        },
        select: { createdAt: true, totalAmount: true },
        orderBy: { createdAt: 'asc' }
    })

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dailyData: Record<string, { sales: number; revenue: number }> = {}

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        dailyData[dayNames[date.getDay()]] = { sales: 0, revenue: 0 }
    }

    orders.forEach(order => {
        const key = dayNames[new Date(order.createdAt).getDay()]
        if (dailyData[key]) {
            dailyData[key].sales += 1
            dailyData[key].revenue += Number(order.totalAmount)
        }
    })

    return Object.entries(dailyData).map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: data.revenue
    }))
}

async function getRecentOrders() {
    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true } },
            items: {
                take: 1,
                select: { productName: true }
            }
        }
    })

    return orders.map(order => ({
        id: `#${order.id.slice(-8).toUpperCase()}`,
        customer: order.user.name,
        product: order.items[0]?.productName || 'Multiple Items',
        amount: `₹${Number(order.totalAmount).toLocaleString('en-IN')}`,
        status: order.status,
        date: order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }))
}

async function getTopCategories() {
    const categories = await prisma.category.findMany({
        where: { type: 'ROOM', isActive: true },
        include: {
            products: {
                include: {
                    product: {
                        include: {
                            orderItems: { select: { quantity: true } }
                        }
                    }
                }
            }
        }
    })

    const categoryStats = categories.map(cat => {
        const total = cat.products.reduce((sum, pc) => {
            return sum + pc.product.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0)
        }, 0)
        return { name: cat.name, total }
    }).sort((a, b) => b.total - a.total).slice(0, 3)

    const grandTotal = categoryStats.reduce((sum, cat) => sum + cat.total, 0)

    return categoryStats.map(cat => ({
        name: cat.name,
        percentage: grandTotal > 0 ? Math.round((cat.total / grandTotal) * 100) : 0
    }))
}

async function getFailedPayments() {
    const payments = await prisma.payment.findMany({
        where: { status: 'FAILED' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            order: {
                include: { user: { select: { name: true } } }
            }
        }
    })

    const total = await prisma.payment.count({ where: { status: 'FAILED' } })

    return {
        payments: payments.map(p => ({
            id: p.id,
            orderId: p.orderId,
            amount: Number(p.amount),
            customerName: p.order.user.name,
            createdAt: p.createdAt.toISOString()
        })),
        total
    }
}

import DatabaseError from '@/components/admin/dashboard/DatabaseError'

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    try {
        const [stats, salesData, recentOrders, topCategories, failedPayments] = await Promise.all([
            getStats(),
            getSalesData(),
            getRecentOrders(),
            getTopCategories(),
            getFailedPayments()
        ])

        const formatCurrency = (value: number) => {
            if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
            if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
            return `₹${value}`
        }

        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors">
                            Download Report
                        </button>
                        <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-medium shadow-lg shadow-indigo-200 transition-all hover:shadow-xl">
                            Add Product +
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.revenue.value)}
                        change={stats.revenue.change}
                        iconName="DollarSign"
                        color="indigo"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.orders.value.toString()}
                        change={stats.orders.change}
                        iconName="ShoppingBag"
                        color="purple"
                        trend={stats.orders.change >= 0 ? 'up' : 'down'}
                    />
                    <StatCard
                        title="Total Users"
                        value={stats.users.value.toString()}
                        change={stats.users.change}
                        iconName="Users"
                        color="orange"
                        trend={stats.users.change >= 0 ? 'up' : 'down'}
                    />
                    <StatCard
                        title="Products"
                        value={stats.products.value.toString()}
                        iconName="Package"
                        color="green"
                        trend="neutral"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SalesChart data={salesData} />
                    </div>
                    <div className="space-y-6">
                        <PaymentFailuresWidget payments={failedPayments.payments} total={failedPayments.total} />
                        <TopCategoriesWidget categories={topCategories} />
                    </div>
                </div>

                <RecentOrdersTable orders={recentOrders} />
            </div>
        )
    } catch (error) {
        return <DatabaseError error={error as Error} />
    }
}

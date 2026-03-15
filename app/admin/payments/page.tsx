import { prisma } from '@/lib/prisma'
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPaymentsPage() {
    const [payments, stats] = await Promise.all([
        prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                order: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        }),
        prisma.payment.groupBy({
            by: ['status'],
            _count: { status: true },
            _sum: { amount: true }
        })
    ])

    const totalPayments = stats.reduce((sum, s) => sum + s._count.status, 0)
    const successPayments = stats.find(s => s.status === 'SUCCESS')?._count.status || 0
    const failedPayments = stats.find(s => s.status === 'FAILED')?._count.status || 0
    const totalRevenue = stats.find(s => s.status === 'SUCCESS')?._sum.amount || 0
    const successRate = totalPayments > 0 ? ((successPayments / totalPayments) * 100).toFixed(1) : '0'

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'FAILED': return <XCircle className="h-4 w-4 text-red-500" />
            case 'REFUNDED': return <RefreshCw className="h-4 w-4 text-blue-500" />
            default: return <Clock className="h-4 w-4 text-yellow-500" />
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'bg-green-100 text-green-700'
            case 'FAILED': return 'bg-red-100 text-red-700'
            case 'REFUNDED': return 'bg-blue-100 text-blue-700'
            default: return 'bg-yellow-100 text-yellow-700'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-500">Monitor and manage all payment transactions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                ₹{Number(totalRevenue).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Success Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{successRate}%</p>
                        </div>
                        <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Payments</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{totalPayments}</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Failed Payments</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{failedPayments}</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Recent Payments</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-mono text-gray-900">
                                            {payment.transactionId || payment.id.slice(-8)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/admin/orders/track/${payment.orderId}`}
                                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            #{payment.orderId.slice(-8).toUpperCase()}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.order.user.name}</div>
                                        <div className="text-xs text-gray-500">{payment.order.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            ₹{Number(payment.amount).toLocaleString('en-IN')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{payment.provider}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${getStatusStyle(payment.status)}`}>
                                            {getStatusIcon(payment.status)}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {payments.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No payments found.
                    </div>
                )}
            </div>
        </div>
    )
}

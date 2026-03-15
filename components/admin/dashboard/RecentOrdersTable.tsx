"use client"
import React from 'react'
import { MoreHorizontal, Eye } from 'lucide-react'
import Link from 'next/link'

interface Order {
    id: string
    customer: string
    product: string
    amount: string
    status: string
    date: string
}

interface RecentOrdersTableProps {
    orders: Order[]
}

const statusConfig: Record<string, { bg: string; text: string }> = {
    'CREATED': { bg: 'bg-slate-100', text: 'text-slate-700' },
    'CONFIRMED': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'SHIPPED': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'DELIVERED': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    'CANCELLED': { bg: 'bg-red-100', text: 'text-red-700' },
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const getStatusStyle = (status: string) => statusConfig[status] || statusConfig['CREATED']
    const formatStatus = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
                    <p className="text-sm text-slate-500">Latest transactions from your store</p>
                </div>
                <Link
                    href="/admin/orders"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center">
                                    <p className="text-slate-500">No orders yet</p>
                                    <p className="text-slate-400 text-sm mt-1">Orders will appear here when customers make purchases</p>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const styles = getStatusStyle(order.status)
                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-mono font-medium text-indigo-600">{order.id}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">{order.customer}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500 max-w-[200px] truncate">{order.product}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{order.amount}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${styles.bg} ${styles.text}`}>
                                                {formatStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap text-right">
                                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

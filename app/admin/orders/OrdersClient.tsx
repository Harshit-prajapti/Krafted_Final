'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { User, Loader2, FileText, Filter, ArrowUpDown, CheckSquare, Square, Download } from 'lucide-react'
import OrderStatusSelect from './OrderStatusSelect'
import { generateBulkDeliverySlips, OrderSlipData } from '@/lib/generateDeliverySlip'

interface OrderFilters {
    status: string
    paymentStatus: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
}

interface Order {
    id: string
    totalAmount: string
    status: string
    paymentStatus: string
    createdAt: string
    user: {
        name: string
        email: string
        phone: string | null
    }
    shippingAddress: {
        firstName: string
        lastName: string
        addressLine1: string
        addressLine2: string | null
        city: string
        state: string
        postalCode: string
        country: string
        phone: string
    }
    items: Array<{
        id: string
        productName: string
        quantity: number
        price: string
        sku: string | null
        colorName: string | null
        size: string | null
    }>
    payments: Array<{
        id: string
        status: string
        transactionId: string | null
        provider: string
    }>
    shipping: {
        trackingNumber: string | null
        carrier: string | null
        status: string
    } | null
    _count: {
        items: number
    }
}

interface OrdersResponse {
    data: Order[]
    meta: {
        page: number
        pageSize: number
        total: number
        totalPages: number
    }
}

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: '' },
    { label: 'Created', value: 'CREATED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
]

const PAYMENT_STATUS_OPTIONS = [
    { label: 'All Payments', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Refunded', value: 'REFUNDED' },
]

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'createdAt-desc' },
    { label: 'Oldest First', value: 'createdAt-asc' },
    { label: 'Amount: High to Low', value: 'totalAmount-desc' },
    { label: 'Amount: Low to High', value: 'totalAmount-asc' },
]

async function fetchOrders(filters: OrderFilters, page: number): Promise<OrdersResponse> {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus)
    params.set('sortBy', filters.sortBy)
    params.set('sortOrder', filters.sortOrder)
    params.set('page', String(page))
    params.set('pageSize', '20')

    const res = await fetch(`/api/admin/orders?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
}

export default function OrdersClient() {
    const [filters, setFilters] = useState<OrderFilters>({
        status: '',
        paymentStatus: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })
    const [page, setPage] = useState(1)
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-orders', filters, page],
        queryFn: () => fetchOrders(filters, page),
        staleTime: 30000
    })

    const orders = data?.data || []
    const meta = data?.meta

    const isAllSelected = orders.length > 0 && orders.every(o => selectedOrders.has(o.id))
    const hasSelection = selectedOrders.size > 0

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedOrders(new Set())
        } else {
            setSelectedOrders(new Set(orders.map(o => o.id)))
        }
    }

    const handleSelectOrder = (orderId: string) => {
        const newSelected = new Set(selectedOrders)
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId)
        } else {
            newSelected.add(orderId)
        }
        setSelectedOrders(newSelected)
    }

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-')
        setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }))
        setPage(1)
    }

    const handleGenerateSlips = async () => {
        if (selectedOrders.size === 0) return

        setIsGeneratingPDF(true)
        try {
            const selectedOrderData = orders.filter(o => selectedOrders.has(o.id))

            const slipData: OrderSlipData[] = selectedOrderData.map(order => ({
                orderId: order.id,
                createdAt: order.createdAt,
                trackingNumber: order.shipping?.trackingNumber,
                customer: {
                    name: order.user.name,
                    email: order.user.email,
                    phone: order.user.phone || order.shippingAddress.phone
                },
                shippingAddress: order.shippingAddress,
                items: order.items.map(item => ({
                    productName: item.productName,
                    quantity: item.quantity,
                    price: Number(item.price),
                    sku: item.sku,
                    colorName: item.colorName,
                    size: item.size
                })),
                payment: {
                    paymentId: order.payments[0]?.transactionId || order.payments[0]?.id,
                    status: order.paymentStatus,
                    amount: Number(order.totalAmount),
                    method: order.payments[0]?.provider === 'RAZORPAY' ? 'Razorpay' : 'Cash on Delivery'
                }
            }))

            await generateBulkDeliverySlips(slipData)
            setSelectedOrders(new Set())
        } catch (error) {
            console.error('Failed to generate PDF:', error)
            alert('Failed to generate delivery slips. Please try again.')
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    const getPaymentStatusStyle = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700'
            case 'PENDING': return 'bg-yellow-100 text-yellow-700'
            case 'FAILED': return 'bg-red-100 text-red-700'
            case 'REFUNDED': return 'bg-blue-100 text-blue-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
                    <p className="text-gray-500">Track and fulfill customer orders.</p>
                </div>

                {hasSelection && (
                    <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                        <span className="text-sm font-medium text-indigo-700">
                            {selectedOrders.size} order{selectedOrders.size > 1 ? 's' : ''} selected
                        </span>
                        <button
                            onClick={handleGenerateSlips}
                            disabled={isGeneratingPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {isGeneratingPDF ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Generate Delivery Slips
                        </button>
                        <button
                            onClick={() => setSelectedOrders(new Set())}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Filters:</span>
                    </div>

                    <select
                        value={filters.status}
                        onChange={(e) => {
                            setFilters(prev => ({ ...prev, status: e.target.value }))
                            setPage(1)
                        }}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <select
                        value={filters.paymentStatus}
                        onChange={(e) => {
                            setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))
                            setPage(1)
                        }}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {PAYMENT_STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2 ml-auto">
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        Failed to load orders. Please try again.
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No orders found matching your filters.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left">
                                    <button
                                        onClick={handleSelectAll}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {isAllSelected ? (
                                            <CheckSquare className="h-5 w-5 text-indigo-600" />
                                        ) : (
                                            <Square className="h-5 w-5" />
                                        )}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className={`${selectedOrders.has(order.id) ? 'bg-indigo-50' : 'hover:bg-gray-50'} transition-colors`}
                                >
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => handleSelectOrder(order.id)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            {selectedOrders.has(order.id) ? (
                                                <CheckSquare className="h-5 w-5 text-indigo-600" />
                                            ) : (
                                                <Square className="h-5 w-5" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</div>
                                        <div className="text-xs text-gray-500">{order._count.items} items</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm text-gray-900">{order.user.name}</div>
                                                <div className="text-xs text-gray-500">{order.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-[10px] leading-4 font-bold rounded-full uppercase ${getPaymentStatusStyle(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {meta && meta.totalPages > 1 && (
                    <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Showing {((meta.page - 1) * meta.pageSize) + 1} to {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} orders
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

"use client"
import React from 'react'
import { AlertTriangle, ArrowRight, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface FailedPayment {
    id: string
    orderId: string
    amount: number
    customerName: string
    createdAt: string
}

interface PaymentFailuresWidgetProps {
    payments: FailedPayment[]
    total: number
}

export default function PaymentFailuresWidget({ payments, total }: PaymentFailuresWidgetProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-50">
                        <AlertTriangle size={20} className="text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Payment Failures</h3>
                        <p className="text-xs text-slate-500">{total} failed transactions</p>
                    </div>
                </div>
                <Link
                    href="/admin/payments?status=failed"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                    View all <ArrowRight size={14} />
                </Link>
            </div>

            <div className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                    <div className="p-8 text-center">
                        <CreditCard size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">No failed payments</p>
                        <p className="text-slate-400 text-xs mt-1">All transactions are successful!</p>
                    </div>
                ) : (
                    payments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{payment.customerName}</p>
                                    <p className="text-xs text-slate-500">Order #{payment.orderId.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-red-600">₹{payment.amount.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

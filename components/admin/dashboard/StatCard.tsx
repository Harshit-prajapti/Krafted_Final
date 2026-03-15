"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, TrendingUp, Users, DollarSign, ShoppingBag, Package, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp
}

interface StatCardProps {
    title: string
    value: string | number
    change?: number
    iconName: string
    trend?: 'up' | 'down' | 'neutral'
    color?: string
}

const colorConfig: Record<string, { bg: string; text: string; gradient: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' }
}

export default function StatCard({ title, value, change, iconName, trend, color = "indigo" }: StatCardProps) {
    const Icon = iconMap[iconName] || Package
    const isPositive = trend === 'up' || (change !== undefined && change > 0)
    const isNegative = trend === 'down' || (change !== undefined && change < 0)
    const colors = colorConfig[color] || colorConfig.indigo

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-bl-[100px] transition-opacity group-hover:opacity-10`} />

            <div className="flex items-start justify-between mb-4 relative">
                <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <Icon size={22} className={colors.text} />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' :
                            isNegative ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {isPositive ? <ArrowUp size={12} /> : isNegative ? <ArrowDown size={12} /> : null}
                        <span>{Math.abs(change)}%</span>
                    </div>
                )}
            </div>

            <div className="relative">
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </motion.div>
    )
}

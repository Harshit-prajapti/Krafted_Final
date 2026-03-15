"use client"
import React from 'react'
import { TrendingUp } from 'lucide-react'

interface Category {
    name: string
    percentage: number
}

interface TopCategoriesWidgetProps {
    categories: Category[]
}

const categoryColors = [
    { bg: 'bg-indigo-500', light: 'bg-indigo-100' },
    { bg: 'bg-purple-500', light: 'bg-purple-100' },
    { bg: 'bg-cyan-500', light: 'bg-cyan-100' },
    { bg: 'bg-amber-500', light: 'bg-amber-100' },
    { bg: 'bg-emerald-500', light: 'bg-emerald-100' },
]

export default function TopCategoriesWidget({ categories }: TopCategoriesWidgetProps) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-indigo-50">
                    <TrendingUp size={20} className="text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900">Top Categories</h3>
                    <p className="text-xs text-slate-500">By sales volume</p>
                </div>
            </div>

            <div className="space-y-4">
                {categories.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No sales data yet</p>
                ) : (
                    categories.map((cat, i) => (
                        <div key={cat.name} className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg ${categoryColors[i]?.light || 'bg-slate-100'} flex items-center justify-center font-bold text-xs text-slate-600`}>
                                #{i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-slate-700 truncate">{cat.name}</span>
                                    <span className="text-sm font-bold text-slate-900">{cat.percentage}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${categoryColors[i]?.bg || 'bg-slate-400'} rounded-full transition-all duration-500`}
                                        style={{ width: `${cat.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

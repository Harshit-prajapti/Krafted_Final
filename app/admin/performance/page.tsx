"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, ShoppingCart, Heart, User, Mail, Phone } from "lucide-react"

export default function PerformancePage() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-performance'],
        queryFn: async () => {
            const res = await fetch('/api/admin/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')
            return res.json()
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    const cartInterest = data?.cartInterest || []
    const wishlistInterest = data?.wishlistInterest || []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Product Performance
                </h1>
                <p className="text-slate-500 mt-2">
                    Insights into customer engagement with your products.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Cart Activity */}
                <Card className="border-indigo-100 shadow-sm">
                    <CardHeader className="bg-indigo-50/30 border-b border-indigo-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <ShoppingCart size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-indigo-900">Active Carts</CardTitle>
                                <CardDescription>Customers with your products in their cart right now</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {cartInterest.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">No active carts found</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {cartInterest.map((item: any) => (
                                    <div key={item.product.id} className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Product Info */}
                                            <div className="flex items-start gap-4 md:w-1/3">
                                                <div className="h-16 w-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                    {item.product.images?.[0]?.imageUrl && (
                                                        <img src={item.product.images[0].imageUrl} alt="" className="h-full w-full object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                                                    <p className="text-sm text-slate-500">In {item.inCarts} carts</p>
                                                    <p className="text-sm font-medium text-indigo-600 mt-1">
                                                        Potential Revenue: ${(item.product.basePrice * item.inCarts).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Interested Users */}
                                            <div className="flex-1">
                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                                    Interested Customers
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {item.interestedUsers.map((user: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-600 border border-slate-100 text-xs font-bold">
                                                                {user.name?.[0] || <User size={14} />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                    <Mail size={12} />
                                                                    <span className="truncate">{user.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Wishlist Activity */}
                <Card className="border-pink-100 shadow-sm">
                    <CardHeader className="bg-pink-50/30 border-b border-pink-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                                <Heart size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-pink-900">Wishlist Activity</CardTitle>
                                <CardDescription>Products widely wishlisted but not yet purchased</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {wishlistInterest.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">No wishlist activity found</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {wishlistInterest.map((item: any) => (
                                    <div key={item.product.id} className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Product Info */}
                                            <div className="flex items-start gap-4 md:w-1/3">
                                                <div className="h-16 w-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                    {item.product.images?.[0]?.imageUrl && (
                                                        <img src={item.product.images[0].imageUrl} alt="" className="h-full w-full object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                                                    <p className="text-sm text-slate-500">In {item.inWishlists} wishlists</p>
                                                </div>
                                            </div>

                                            {/* Interested Users */}
                                            <div className="flex-1">
                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                                    Interested Customers
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {item.interestedUsers.map((user: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-600 border border-slate-100 text-xs font-bold">
                                                                {user.name?.[0] || <User size={14} />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

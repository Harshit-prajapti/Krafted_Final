"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    FolderTree,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    BarChart3,
    AlertTriangle,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

interface AdminSidebarProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
    isMobile: boolean
}

const navSections = [
    {
        title: 'Main',
        items: [
            { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        ]
    },
    {
        title: 'Management',
        items: [
            { name: 'Products', href: '/admin/products', icon: Package, badge: null },
            { name: 'Categories', href: '/admin/categories', icon: FolderTree },
            { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
            { name: 'Users', href: '/admin/users', icon: Users },
        ]
    },
    {
        title: 'Analytics',
        items: [
            { name: 'Payments', href: '/admin/payments', icon: CreditCard },
            { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
        ]
    }
]

export default function AdminSidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed, isMobile }: AdminSidebarProps) {
    const pathname = usePathname()

    const sidebarWidth = isCollapsed ? 80 : 280

    return (
        <>
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <motion.aside
                initial={false}
                animate={{
                    width: isMobile ? 280 : sidebarWidth,
                    x: isMobile ? (isOpen ? 0 : -280) : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen bg-slate-900 flex flex-col",
                    "border-r border-slate-800"
                )}
            >
                <div className={cn(
                    "h-16 flex items-center border-b border-slate-800",
                    isCollapsed ? "justify-center px-2" : "justify-between px-6"
                )}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">K</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Krafted</h1>
                                <p className="text-xs text-slate-500">Admin Panel</p>
                            </div>
                        </div>
                    )}

                    {isCollapsed && (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                    )}

                    {isMobile && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            {!isCollapsed && (
                                <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => isMobile && setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                                isActive
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                            )}
                                            title={isCollapsed ? item.name : undefined}
                                        >
                                            <item.icon size={20} className="shrink-0" />

                                            {!isCollapsed && (
                                                <span className="font-medium text-sm">{item.name}</span>
                                            )}

                                            {isCollapsed && isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {!isMobile && (
                    <div className="p-3 border-t border-slate-800">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
                        </button>
                    </div>
                )}

                <div className="p-3 border-t border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>
        </>
    )
}

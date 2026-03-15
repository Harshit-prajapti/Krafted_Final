import React, { useState, useEffect, useRef } from 'react'
import { Search, Bell, Menu, ChevronDown, AlertCircle, CheckCircle, Clock, Plus, AlertTriangle, X, Package, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'

interface AdminHeaderProps {
    sidebarOpen: boolean
    setSidebarOpen: (value: boolean) => void
    isMobile: boolean
}

const breadcrumbMap: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/products': 'Products',
    '/admin/products/add': 'Add Product',
    '/admin/categories': 'Categories',
    '/admin/categories/add': 'Add Category',
    '/admin/orders': 'Orders',
    '/admin/users': 'Users',
    '/admin/payments': 'Payments',
    '/admin/reports': 'Reports',
    '/admin/settings': 'Settings',
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen, isMobile }: AdminHeaderProps) {
    const { data: session } = useSession()
    const pathname = usePathname()
    const router = useRouter()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showAlerts, setShowAlerts] = useState(false)
    const [orderSearch, setOrderSearch] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const searchOrders = async () => {
            if (orderSearch.length < 3) {
                setSearchResults([])
                return
            }

            setIsSearching(true)
            try {
                const res = await fetch(`/api/admin/orders/search?q=${encodeURIComponent(orderSearch)}`)
                if (res.ok) {
                    const data = await res.json()
                    setSearchResults(data.orders || [])
                }
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setIsSearching(false)
            }
        }

        const debounce = setTimeout(searchOrders, 300)
        return () => clearTimeout(debounce)
    }, [orderSearch])

    const handleOrderClick = (orderId: string) => {
        setShowSearchResults(false)
        setOrderSearch('')
        router.push(`/admin/orders/track/${orderId}`)
    }

    const { data: notificationsData } = useQuery({
        queryKey: ['admin-notifications'],
        queryFn: async () => {
            const res = await fetch('/api/admin/notifications')
            if (!res.ok) throw new Error('Failed to fetch notifications')
            return res.json()
        },
        refetchInterval: 30000
    })

    const formatTimeAgo = (isoString: string) => {
        const diff = Date.now() - new Date(isoString).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 60) return `${minutes} min ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
        return `${Math.floor(hours / 24)} day${hours >= 48 ? 's' : ''} ago`
    }

    const notifications = (notificationsData?.notifications || []).map((n: any) => ({
        ...n,
        time: formatTimeAgo(n.time)
    }))
    const alerts = (notificationsData?.alerts || []).map((a: any) => ({
        ...a,
        time: formatTimeAgo(a.time)
    }))

    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean)
        const crumbs: { label: string; href: string }[] = []
        let currentPath = ''

        paths.forEach((path) => {
            currentPath += `/${path}`
            const label = breadcrumbMap[currentPath] || path.charAt(0).toUpperCase() + path.slice(1)
            crumbs.push({ label, href: currentPath })
        })

        return crumbs
    }

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden"
                    >
                        <Menu size={20} />
                    </button>
                )}

                <nav className="hidden md:flex items-center gap-2 text-sm">
                    {getBreadcrumbs().map((crumb, index, arr) => (
                        <React.Fragment key={crumb.href}>
                            {index > 0 && <span className="text-slate-300">/</span>}
                            {index === arr.length - 1 ? (
                                <span className="font-medium text-slate-900">{crumb.label}</span>
                            ) : (
                                <Link href={crumb.href} className="text-slate-500 hover:text-indigo-600 transition-colors">
                                    {crumb.label}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative hidden lg:block" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search orders by ID..."
                        value={orderSearch}
                        onChange={(e) => {
                            setOrderSearch(e.target.value)
                            setShowSearchResults(true)
                        }}
                        onFocus={() => setShowSearchResults(true)}
                        className="w-72 pl-10 pr-4 py-2 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all text-sm"
                    />
                    {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
                    )}

                    {showSearchResults && orderSearch.length >= 3 && (
                        <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                            {isSearching ? (
                                <div className="p-4 text-center text-slate-400 text-sm">Searching...</div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-4 text-center text-slate-400 text-sm">No orders found</div>
                            ) : (
                                <div className="max-h-80 overflow-y-auto">
                                    {searchResults.map((order: any) => (
                                        <button
                                            key={order.id}
                                            onClick={() => handleOrderClick(order.id)}
                                            className="w-full p-3 hover:bg-slate-50 border-b border-slate-100 text-left flex items-center gap-3"
                                        >
                                            <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <Package size={18} className="text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">
                                                    #{order.id.slice(-8).toUpperCase()}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {order.user?.name} • ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>


                {/* Quick Actions */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                    <Link href="/admin/products/add">
                        <Button variant="outline" size="sm" className="h-9 gap-1 text-slate-600 hover:text-indigo-600 hover:border-indigo-200">
                            <Plus size={16} />
                            Add Product
                        </Button>
                    </Link>
                    <Link href="/admin/categories/add">
                        <Button variant="outline" size="sm" className="h-9 gap-1 text-slate-600 hover:text-indigo-600 hover:border-indigo-200">
                            <Plus size={16} />
                            Add Category
                        </Button>
                    </Link>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block" />

                {/* Alerts (Critical) */}
                <div className="relative">
                    <button
                        onClick={() => { setShowAlerts(!showAlerts); setShowNotifications(false) }}
                        className="relative p-2.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                        <AlertTriangle size={20} className={alerts.length > 0 ? "text-red-500" : ""} />
                        {alerts.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                    </button>

                    {showAlerts && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowAlerts(false)} />
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-red-100 z-50 overflow-hidden">
                                <div className="p-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
                                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                                        <AlertCircle size={16} /> Critical Alerts
                                    </h3>
                                    <button onClick={() => setShowAlerts(false)}><X size={16} className="text-slate-400 hover:text-slate-600" /></button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {alerts.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">No critical alerts</div>
                                    ) : (
                                        alerts.map((notif: any) => (
                                            <div key={notif.id} className="p-4 hover:bg-red-50/10 border-b border-slate-50">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-slate-800 font-medium">{notif.message}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                                    ) : (
                                        notifications.map((notif: any) => (
                                            <div key={notif.id} className="p-4 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                                                <div className="flex items-start gap-3">
                                                    {notif.type === 'error' && <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />}
                                                    {notif.type === 'success' && <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />}
                                                    {notif.type === 'warning' && <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-slate-700">{notif.message}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Link href="/admin/notifications" className="block p-3 text-center text-sm text-indigo-600 hover:bg-slate-50 font-medium">
                                    View all notifications
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="h-8 w-px bg-slate-200 mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-900">{session?.user?.name || 'Admin'}</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                </div>
            </div>
        </header>
    )
}


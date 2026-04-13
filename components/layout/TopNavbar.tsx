"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, User, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, Home, Package, Grid3x3, UserCircle, LogIn, Info, LogOut, Settings, ChevronDown, Heart, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useSession, signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'


function TopNavbar() {
    const { t } = useTranslation('common')
    return (
        <div className="w-full bg-gradient-to-r from-[#1a1a1a] via-[#2d2416] to-[#1a1a1a] border-b border-amber-500/30 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-shimmer" />
            <div className="container mx-auto px-4 md:px-6 relative z-[60]">
                <div className="flex h-11 items-center justify-between text-xs md:h-12 md:text-sm">

                    <div className="flex items-center space-x-3 md:space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                            className="text-white hover:text-white/70 transition-all hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                            <Facebook size={20} className="md:w-6 md:h-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                            className="text-white hover:text-white/70 transition-all hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                            <Instagram size={20} className="md:w-6 md:h-6" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                            className="hidden sm:block text-white hover:text-white/70 transition-all hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                            <Twitter size={20} className="md:w-6 md:h-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                            className="hidden sm:block text-white hover:text-white/70 transition-all hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                            <Linkedin size={20} className="md:w-6 md:h-6" />
                        </a>
                    </div>

                    {/* <div className="hidden md:block flex-1 lg:flex-none text-center">
                        <p className="tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent font-medium">
                            <span className="hidden lg:inline text-lg">{t('topBar.freeShipping')} </span>
                            <span className="text-lg">| {t('topBar.shopNow')}</span>
                        </p>
                    </div> */}

                    <div className="lg:hidden">
                        <LanguageSwitcher variant="desktop" />
                    </div>

                    <div className="hidden lg:flex items-center space-x-6">
                        <a href="tel:+1234567890" className="flex items-center space-x-2 text-amber-400/80 hover:text-amber-300 transition-colors group">
                            <Phone size={20} className="group-hover:scale-110 transition-transform group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            <span className="text-lg bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">+91 8889997527</span>
                        </a>
                        <a href="mailto:info@krafted.com" className="flex items-center space-x-2 text-amber-400/80 hover:text-amber-300 transition-colors group">
                            <Mail size={24} className="group-hover:scale-110 transition-transform group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            <span className="text-lg bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">krafter888k@gmail.com</span>
                        </a>

                        <div className="border-l border-amber-500/30 pl-6">
                            <LanguageSwitcher variant="desktop" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BrandMark({ compact = false }: { compact?: boolean }) {
    return (
        <div className="flex min-w-0 flex-col items-center text-center leading-none">
            <div className="flex flex-col items-center">
                <svg
                    width={compact ? 24 : 28}
                    height={compact ? 16 : 18}
                    viewBox="0 0 28 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-0.5 shrink-0"
                >
                    <path d="M14 0L16.5 6L22 3L20 12H8L6 3L11.5 6L14 0Z" fill="#C5A028" />
                    <rect x="7" y="12" width="14" height="3" rx="0.5" fill="#C5A028" />
                    <circle cx="10" cy="13.5" r="0.8" fill="#1a1a1a" />
                    <circle cx="14" cy="13.5" r="0.8" fill="#1a1a1a" />
                    <circle cx="18" cy="13.5" r="0.8" fill="#1a1a1a" />
                    <circle cx="14" cy="1" r="1.2" fill="#D4AF37" />
                    <circle cx="6" cy="3.5" r="1" fill="#D4AF37" />
                    <circle cx="22" cy="3.5" r="1" fill="#D4AF37" />
                </svg>
                <div className="flex items-baseline leading-none" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    <span className={cn('font-bold text-[#2c2c2c]', compact ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl')}>K</span>
                    <span className={cn('font-bold text-[#C5A028]', compact ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl')}>R</span>
                </div>
            </div>

            <div
                className={cn(
                    'mt-1 whitespace-nowrap font-bold text-[#2c2c2c]',
                    compact
                        ? 'text-[0.72rem] tracking-[0.18em]'
                        : 'text-[0.78rem] tracking-[0.18em] sm:text-[0.9rem] sm:tracking-[0.22em] md:text-lg md:tracking-[0.25em]'
                )}
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
                KRAFTED ROYALE
            </div>

            <div
                className={cn(
                    'mt-1 h-[1px] bg-gradient-to-r from-transparent via-[#C5A028] to-transparent',
                    compact ? 'w-[108px]' : 'w-[118px] sm:w-[138px]'
                )}
            />
        </div>
    )
}


export default function Navbar() {
    const { t } = useTranslation('common')
    const { data: session, status } = useSession()
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

    const { data: cart } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await fetch('/api/cart')
            if (!res.ok) return null
            return res.json()
        },
        enabled: !!session, // Only fetch if logged in
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: true,
    })

    const cartCount = cart?.itemCount || 0

    const fallbackCategoryCards = [
        { slug: 'living-room', label: t('categories.livingRoom'), image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop' },
        { slug: 'bedroom', label: t('categories.bedroom'), image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=200&h=200&fit=crop' },
        { slug: 'sofas', label: 'Sofas', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&h=200&fit=crop' },
        { slug: 'beds', label: 'Beds', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=200&h=200&fit=crop' },
        { slug: 'modern', label: 'Modern', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop' },
        { slug: 'vintage', label: 'Vintage', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=200&h=200&fit=crop' },
    ]

    const { data: navCategories = fallbackCategoryCards } = useQuery({
        queryKey: ['nav-categories'],
        queryFn: async () => {
            const res = await fetch('/api/categories?isActive=true&includeChildren=true')
            if (!res.ok) {
                return fallbackCategoryCards
            }

            const data = await res.json()
            if (!Array.isArray(data) || data.length === 0) {
                return fallbackCategoryCards
            }

            return data.slice(0, 6).map((category: { name: string; slug: string }) => ({
                slug: category.slug,
                label: category.name,
                image: fallbackCategoryCards.find((item) => item.slug === category.slug)?.image
                    || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop',
            }))
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    const navLinks = [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.shop'), href: '/shop' },
        { name: t('nav.categories'), href: '/categories' },
        { name: t('nav.about'), href: '/about' },
        { name: t('nav.contact'), href: '/contact' },
    ]

    const quickNavItems = [
        { name: t('nav.home'), href: '/', icon: Home },
        { name: t('nav.about'), href: '/about', icon: Info },
        { name: t('nav.categories'), href: '/categories', icon: Grid3x3 },
        { name: t('nav.profile'), href: '/profile', icon: UserCircle },
        { name: t('nav.shop'), href: '/shop', icon: Store },
        { name: t('nav.cart'), href: '/cart', icon: ShoppingBag },
    ]

    const pathname = usePathname()

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) {
        return null
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{
                    opacity: isScrolled ? 0 : 1,
                    y: isScrolled ? -100 : 0,
                    height: isScrolled ? 0 : 'auto'
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 w-full z-50"
            >
                <TopNavbar />
            </motion.div>

            {/* Main Navigation */}
            <motion.nav
                className={cn(
                    "fixed w-full z-50 overflow-visible transition-all duration-300 border-b bg-white/95 backdrop-blur-xl",
                    isScrolled
                        ? "top-0 min-h-[112px] border-white/10 py-4 shadow-lg md:min-h-[118px]"
                        : "top-[44px] min-h-[124px] border-amber-200/50 py-5 shadow-[0_16px_35px_rgba(0,0,0,0.10)] md:top-[48px] md:min-h-[134px] md:py-6"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto grid min-h-[84px] grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 px-4 md:flex md:min-h-[88px] md:items-center md:justify-between md:px-6">
                    {/* Mobile Menu Button */}
                    <button
                        className="flex h-9 w-9 items-center justify-center text-foreground hover:text-gold transition-colors md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="mx-auto flex min-w-0 items-center justify-center justify-self-center py-1 md:mx-0">
                        <BrandMark />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium uppercase tracking-widest text-foreground hover:text-gold transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center justify-self-end space-x-3 md:space-x-6">
                        <Link href="/search" className="text-foreground hover:text-gold transition-colors">
                            <Search size={20} />
                        </Link>
                        <Link href="/wishlist" className="text-foreground hover:text-gold transition-colors">
                            <Heart size={20} />
                        </Link>
                        <Link href="/cart" className="relative text-foreground hover:text-gold transition-colors">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gold text-white text-[0.6rem] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth Section */}
                        {status === "loading" ? (
                            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center gap-2 text-foreground hover:text-gold transition-colors group"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#c9a24d] to-[#d6b45a] flex items-center justify-center text-white font-bold text-sm">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDown className="h-4 w-4 hidden lg:block group-hover:rotate-180 transition-transform" />
                                </button>

                                {/* Profile Dropdown */}
                                {profileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                                        onMouseLeave={() => setProfileDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-bold text-gray-900 text-sm">{session.user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <User className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm font-semibold text-gray-700">{t('nav.profile')}</span>
                                        </Link>
                                        <Link
                                            href="/profile/orders"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Package className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm font-semibold text-gray-700">{t('nav.orders')}</span>
                                        </Link>
                                        <Link
                                            href="/profile/settings"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Settings className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm font-semibold text-gray-700">{t('nav.settings')}</span>
                                        </Link>
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(false)
                                                    signOut({ callbackUrl: '/' })
                                                }}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full text-left"
                                            >
                                                <LogOut className="h-4 w-4 text-red-600" />
                                                <span className="text-sm font-semibold text-red-600">{t('nav.logout')}</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <Link href="/user/login" className="hidden md:block">
                                <Button variant="luxury" size="sm" className="hidden lg:flex">
                                    {t('nav.signIn')}
                                </Button>
                                <span className="lg:hidden text-foreground hover:text-gold">
                                    <User size={20} />
                                </span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Sidebar */}
                {mobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="md:hidden fixed inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            className="md:hidden fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                        <BrandMark compact />
                                    </Link>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-foreground hover:text-gold transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="p-6 border-b border-gray-200">
                                    <Link
                                        href="/search"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <Search size={20} className="text-gray-600" />
                                        <span className="text-gray-600">{t('nav.searchProducts')}</span>
                                    </Link>
                                </div>

                                {/* Mobile Language Switcher */}
                                <div className="p-6 border-b border-gray-200">
                                    <LanguageSwitcher variant="mobile" />
                                </div>

                                {/* Categories Section */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="p-6">
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                            {t('nav.categories')}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {navCategories.map((category) => (
                                                <Link
                                                    key={category.slug}
                                                    href={`/categories/${category.slug}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="group"
                                                >
                                                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2 border border-gray-200 group-hover:border-gold transition-colors">
                                                        <img
                                                            src={category.image}
                                                            alt={category.label}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                                                    </div>
                                                    <p className="text-sm font-medium text-center text-gray-800 group-hover:text-gold transition-colors">
                                                        {category.label}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Quick Navigation */}
                                <div className="border-t border-gray-200 bg-white">
                                    <div className="grid grid-cols-3 gap-2 p-4">
                                        {quickNavItems.map((item) => {
                                            const Icon = item.icon
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <Icon size={24} className="text-gray-700" />
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.nav>
        </>
    )
}

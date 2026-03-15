import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, User, Heart, LogOut, Package, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
    const { t } = useTranslation('common')
    const { data: session, status } = useSession()
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [cartCount, setCartCount] = useState(0)

    // Fetch cart count
    useEffect(() => {
        const fetchCartCount = async () => {
            if (status === 'authenticated') {
                try {
                    const res = await fetch('/api/cart/count')
                    const data = await res.json()
                    setCartCount(data.count || 0)
                } catch (error) {
                    console.error('Failed to fetch cart count:', error)
                }
            } else {
                setCartCount(0)
            }
        }

        fetchCartCount()
    }, [status, session])

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    const navLinks = [
        { name: t('nav.home', 'Home'), href: '/' },
        { name: t('nav.shop', 'Shop'), href: '/shop' },
        { name: t('nav.categories', 'Categories'), href: '/categories' },
        { name: t('nav.about', 'About'), href: '/about' },
        { name: t('nav.contact', 'Contact'), href: '/contact' },
    ]

    return (
        <motion.nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent bg-white",
                isScrolled
                    ? " border-white/10 shadow-lg py-4"
                    : "bg-transparent py-6"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-foreground hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex flex-col items-center md:items-start group">
                    {/* <div className="logo-image">
                        <Image alt='logo' height={50} width={50} src={"https://static.wixstatic.com/media/8266d8_ac4000cf05814069b9c6fa2f72d81a9a~mv2.png/v1/fill/w_338,h_338,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8266d8_ac4000cf05814069b9c6fa2f72d81a9a~mv2.png"}/>
                    </div> */}
                    <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-wider text-foreground group-hover:text-gold transition-colors">
                        KRAFTED
                    </h1>
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground group-hover:text-gold/80 transition-colors">
                        Furniture
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium uppercase tracking-widest text-foreground hover:text-gold transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <LanguageSwitcher />

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
                                        <span className="text-sm font-semibold text-gray-700">{t('nav.profile', 'My Profile')}</span>
                                    </Link>
                                    <Link
                                        href="/profile/orders"
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        <Package className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm font-semibold text-gray-700">{t('nav.orders', 'My Orders')}</span>
                                    </Link>
                                    <Link
                                        href="/profile/settings"
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        <Settings className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm font-semibold text-gray-700">{t('nav.settings', 'Settings')}</span>
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
                                            <span className="text-sm font-semibold text-red-600">{t('nav.logout', 'Logout')}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <Link href="/user/login" className="hidden md:block">
                            <Button variant="luxury" size="sm" className="hidden lg:flex bg-green">
                                {t('nav.signIn', 'Sign In')}
                            </Button>
                            <span className="lg:hidden text-foreground hover:text-gold">
                                <User size={20} />
                            </span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border p-4 shadow-xl text-black"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-foreground hover:text-gold py-2 border-b border-border/50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="py-2 border-b border-border/50">
                            <LanguageSwitcher variant="mobile" />
                        </div>

                        {session ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-medium text-foreground hover:text-gold py-2 border-b border-border/50"
                                >
                                    {t('nav.profile', 'My Profile')}
                                </Link>
                                <Link
                                    href="/profile/orders"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-medium text-foreground hover:text-gold py-2 border-b border-border/50"
                                >
                                    {t('nav.orders', 'My Orders')}
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        signOut({ callbackUrl: '/' })
                                    }}
                                    className="text-left text-lg font-medium text-red-600 hover:text-red-700 py-2"
                                >
                                    {t('nav.logout', 'Logout')}
                                </button>
                            </>
                        ) : (
                            <Link href="/user/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full mt-4" variant="luxury">{t('nav.signIn', 'Sign In')}</Button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    )
}

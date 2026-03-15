"use client"
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Using a simple state-based implementation instead of complex Sheet primitives for speed/clarity here
// In a full app, you'd want to use a global state manager (Zustand/Context) to toggle this.

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background border-l border-border z-50 shadow-2xl flex flex-col"
                    >
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                                <ShoppingBag size={20} /> Your Cart (2)
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Mock Items */}
                            <div className="flex gap-4">
                                <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h3 className="font-medium text-sm">The Royal Sovereign Sofa</h3>
                                        <button className="text-muted-foreground hover:text-black"><X size={14} /></button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">Dark Brown Leather</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center border border-border rounded-sm h-8">
                                            <button className="px-2 hover:bg-muted h-full">-</button>
                                            <span className="px-2 text-xs">1</span>
                                            <button className="px-2 hover:bg-muted h-full">+</button>
                                        </div>
                                        <span className="font-bold text-gold">$3,200.00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1513506003013-1b6a511ffa51?q=80" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h3 className="font-medium text-sm">Art Deco Lamp</h3>
                                        <button className="text-muted-foreground hover:text-black"><X size={14} /></button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">Gold Finish</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center border border-border rounded-sm h-8">
                                            <button className="px-2 hover:bg-muted h-full">-</button>
                                            <span className="px-2 text-xs">2</span>
                                            <button className="px-2 hover:bg-muted h-full">+</button>
                                        </div>
                                        <span className="font-bold text-gold">$500.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border p-6 space-y-4 bg-secondary/5">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>$3,700.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
                                    <span>Total</span>
                                    <span className="text-gold">$3,700.00</span>
                                </div>
                            </div>
                            <Link href="/checkout" className="block w-full">
                                <Button variant="luxury" className="w-full py-6 text-lg">Checkout</Button>
                            </Link>
                            <p className="text-xs text-center text-muted-foreground">
                                Free shipping on orders over $1,000
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

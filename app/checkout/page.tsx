import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCart } from '@/lib/cart/service'
import { prisma } from '@/lib/prisma'
import CheckoutClient from '@/components/checkout/CheckoutClient'
import { serialize } from '@/lib/serialize'
import { ShoppingBag, ShieldCheck, Truck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CheckoutPage() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login?callbackUrl=/checkout')
    }

    const [cart, addresses] = await Promise.all([
        getCart(),
        prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { isDefault: 'desc' }
        })
    ])

    if (!cart || cart.items.length === 0) {
        redirect('/cart')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <p className="text-amber-600 text-sm font-bold uppercase tracking-widest mb-1">Secure Checkout</p>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Complete Your Order</h1>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-amber-600" />
                                <span>Free Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>

                <CheckoutClient
                    initialCart={serialize(cart)}
                    initialAddresses={serialize(addresses)}
                    userEmail={session.user.email}
                />
            </div>
        </div>
    )
}

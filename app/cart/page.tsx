// app/cart/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCart } from '@/lib/cart/service'
import CartClient from '@/components/cart/CartClient'
import PageHeader from '@/components/ui/PageHeader'

export default async function CartPage() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/user/login?callbackUrl=/cart')
    }

    const cartData = await getCart()

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-16">
            <PageHeader
                badge="Shopping"
                title="Your Cart"
                subtitle="Review your items before checkout"
                variant="light"
            />
            <div className="container mx-auto px-4">
                <CartClient initialCart={cartData} />
            </div>
        </div>
    )
}
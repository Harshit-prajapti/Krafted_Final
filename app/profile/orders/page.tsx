import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import OrdersClient from '@/components/profile/OrdersClient'
import { serialize } from '@/lib/serialize'
import PageHeader from '@/components/ui/PageHeader'

export default async function OrdersPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/user/login?callbackUrl=/profile/orders')
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            items: {
                take: 3,
                include: {
                    product: {
                        include: {
                            images: { take: 1, orderBy: { priority: 'asc' } }
                        }
                    }
                }
            },
            shippingAddress: true,
            shipping: true,
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-16">
            <PageHeader
                badge="Order History"
                title="My Orders"
                subtitle="Track and manage your furniture orders"
                variant="light"
            />
            <div className="container mx-auto px-4 max-w-6xl">
                <OrdersClient orders={serialize(orders)} />
            </div>
        </div>
    )
}

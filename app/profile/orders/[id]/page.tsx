import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import OrderDetailsClient from '@/components/profile/OrderDetailsClient'
import { serialize } from '@/lib/serialize'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: PageProps) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/user/login')
    }

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            images: {
                                orderBy: { priority: 'asc' },
                                take: 1
                            }
                        }
                    },
                    variant: {
                        include: {
                            color: true
                        }
                    }
                }
            },
            shippingAddress: true,
            billingAddress: true,
            shipping: true,
            history: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!order) {
        redirect('/profile/orders')
    }

    // Check if user owns this order
    if (order.userId !== session.user.id) {
        redirect('/profile/orders')
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 pt-32">
            <div className="container mx-auto px-4 max-w-6xl">
                <OrderDetailsClient order={serialize(order)} />
            </div>
        </div>
    )
}

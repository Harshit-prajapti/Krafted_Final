import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileClient from '@/components/profile/ProfileClient'
import { serialize } from '@/lib/serialize'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/user/login?callbackUrl=/profile')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            createdAt: true,
        }
    })

    const [orders, addresses] = await Promise.all([
        prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                totalAmount: true,
                status: true,
                createdAt: true,
            }
        }),
        prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { isDefault: 'desc' },
            take: 3,
        })
    ])

    if (!user) {
        redirect('/user/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <ProfileClient
                    user={serialize(user) as any}
                    orders={serialize(orders) as any}
                    addresses={serialize(addresses) as any}
                />
            </div>
        </div>
    )
}


import { prisma } from '@/lib/prisma'
import { Users, ShoppingCart, Heart, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    // Fetch users with cart and wishlist item counts
    const users = await prisma.user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    wishlist: true,
                    orders: true
                }
            },
            carts: {
                include: {
                    _count: {
                        select: { items: true }
                    }
                }
            },
            wishlist: {
                include: {
                    product: {
                        select: { name: true }
                    }
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Activity</h1>
                <p className="text-gray-500">Track user carts, wishlists, and shopping behavior.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cart Items</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wishlist</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => {
                            const cartItemCount = user.carts?._count.items || 0
                            const wishlistCount = user._count.wishlist || 0
                            const hasActivity = cartItemCount > 0 || wishlistCount > 0

                            return (
                                <tr key={user.id} className={hasActivity ? 'bg-blue-50/30' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {hasActivity ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Active Shopper
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                                Idle
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <ShoppingCart className={`h-4 w-4 mr-2 ${cartItemCount > 0 ? 'text-blue-600' : 'text-gray-300'}`} />
                                            {cartItemCount} items
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Heart className={`h-4 w-4 mr-2 ${wishlistCount > 0 ? 'text-rose-600' : 'text-gray-300'}`} />
                                            {wishlistCount} items
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                    Pro-tip: Active Shoppers highlighted in light blue have items in their cart or wishlist.
                    Target them with special offers or reminders!
                </p>
            </div>
        </div>
    )
}

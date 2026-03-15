import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import WishlistClient from '@/components/wishlist/WishlistClient'
import PageHeader from '@/components/ui/PageHeader'

export default async function WishlistPage() {
    const session = await getServerSession(authOptions)

    // Authentication check only - redirect if not logged in
    if (!session) {
        redirect('/user/login?callbackUrl=/wishlist')
    }

    // React Query handles data fetching client-side for:
    // - Optimal caching (60s stale time)
    // - Instant navigation from cached data
    // - Optimistic updates on mutations
    // - Background refetching

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-16">
            <PageHeader
                badge="Your Favorites"
                title="Wishlist"
                subtitle="Items you've saved for later"
                variant="light"
            />
            <div className="container mx-auto px-4">
                <WishlistClient />
            </div>
        </div>
    )
}

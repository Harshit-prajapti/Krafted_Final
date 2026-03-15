import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AddressForm from '@/components/profile/AddressForm'

export default async function AddAddressPage({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl?: string }>
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/user/login')
    }

    const resolvedParams = await searchParams
    const callbackUrl = resolvedParams.callbackUrl || '/profile/addresses'

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Add New Address</h1>
                    <p className="text-gray-500 mb-8">Fill in the details below to add a new shipping address</p>
                    <AddressForm callbackUrl={callbackUrl} />
                </div>
            </div>
        </div>
    )
}

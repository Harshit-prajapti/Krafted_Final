export default function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header skeleton */}
                <div className="mb-8 space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form skeleton */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Address section */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
                                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                        {/* Payment section */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                            <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
                            <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Order summary skeleton */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50">
                                    <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-1">
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                            <div className="h-12 w-full bg-gray-900 rounded-xl animate-pulse mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ShopLoading() {
    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6">
                    <div className="text-center md:text-left space-y-3">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
                        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter sidebar skeleton */}
                    <div className="hidden lg:block w-64 shrink-0 space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                                <div className="space-y-2">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Product grid skeleton */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="aspect-square bg-gray-200 animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

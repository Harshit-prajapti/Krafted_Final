export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-6xl space-y-8">
                {/* Header skeleton */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>

                {/* Stats skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
                            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Content skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit space-y-4">
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-1">
                                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

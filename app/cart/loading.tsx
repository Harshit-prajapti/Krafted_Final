import { Loader2 } from 'lucide-react'

export default function CartLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header skeleton */}
                <div className="space-y-2 mb-10">
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Cart items skeleton */}
                    <div className="lg:col-span-8">
                        <div className="bg-gray-50/80 rounded-3xl p-6 lg:p-8 border border-gray-100 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                    <div className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary skeleton */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-background pt-28 md:pt-32">
            <div className="container mx-auto px-4">
                {/* Breadcrumb skeleton */}
                <div className="flex gap-2 mb-8">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Product layout skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Image skeleton */}
                    <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />

                    {/* Info skeleton */}
                    <div className="space-y-6 lg:py-4">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="space-y-2 pt-4">
                            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse" />
                        </div>
                        {/* Color swatches skeleton */}
                        <div className="flex gap-2 pt-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                            ))}
                        </div>
                        {/* Buttons skeleton */}
                        <div className="flex gap-3 pt-6">
                            <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

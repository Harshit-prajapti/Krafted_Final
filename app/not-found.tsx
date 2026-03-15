import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
            <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

                {/* Abstract Art / 404 Representation */}
                <div className="relative h-40 flex items-center justify-center">
                    <h1 className="text-[12rem] font-black text-gray-50 leading-none select-none tracking-tighter">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl font-serif italic text-gray-900 bg-white px-4 py-1 border border-gray-100 shadow-sm">
                            Page Not Found
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-light text-gray-900 tracking-wide">
                        Lost in the showroom?
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return Home</span>
                    </Link>

                    <Link
                        href="/shop"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 text-sm font-bold tracking-widest uppercase hover:bg-gray-50 hover:border-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

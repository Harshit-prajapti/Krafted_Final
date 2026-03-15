'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfileError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('[ProfileError]', error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 pt-28">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-gray-900">
                        Couldn't load your profile
                    </h2>
                    <p className="text-gray-500">
                        We had trouble loading your account details. Please try again.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Retry
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

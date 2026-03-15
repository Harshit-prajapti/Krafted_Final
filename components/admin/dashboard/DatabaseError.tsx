'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DatabaseError({ error, reset }: { error?: Error; reset?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-red-100 p-8 text-center space-y-4 shadow-sm">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-bold text-gray-900">Connection Issue</h3>
                <p className="text-gray-500">
                    We couldn't connect to the database. This might be due to a temporary outage or network issue.
                </p>
                {error && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-left text-gray-600 font-mono overflow-auto max-h-24 border border-gray-200">
                        {error.message}
                    </div>
                )}
            </div>
            {reset && (
                <Button
                    onClick={reset}
                    variant="outline"
                    className="gap-2 mt-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    )
}

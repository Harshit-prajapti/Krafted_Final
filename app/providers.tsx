'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Global defaults - conservative for e-commerce
                staleTime: 60 * 1000, // 1 minute default
                gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
                retry: 1, // Retry failed requests once
                refetchOnWindowFocus: false, // Disabled by default, enable per-query
                refetchOnReconnect: true, // Refetch on network reconnect
                refetchOnMount: true, // Refetch on component mount if stale
            },
            mutations: {
                retry: 1, // Retry failed mutations once
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    )
}

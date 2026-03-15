'use client'

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export type CartStatus = 'idle' | 'adding' | 'added' | 'error'

interface UseAddToCartOptions {
    onSuccess?: () => void
    onError?: (error: Error) => void
    resetDelay?: number
}

export function useAddToCart(options: UseAddToCartOptions = {}) {
    const { resetDelay = 2000 } = options
    const [status, setStatus] = useState<CartStatus>('idle')
    const queryClient = useQueryClient()
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: async ({
            productId,
            variantId,
            quantity = 1
        }: {
            productId: string
            variantId?: string | null
            quantity?: number
        }) => {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, variantId, quantity })
            })

            if (res.status === 401) {
                router.push('/user/login?callbackUrl=' + window.location.pathname)
                throw new Error('Please login to add items to cart')
            }

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to add to cart')
            }

            return res.json()
        },
        onMutate: () => {
            setStatus('adding')
        },
        onSuccess: () => {
            setStatus('added')
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            options.onSuccess?.()

            setTimeout(() => {
                setStatus('idle')
            }, resetDelay)
        },
        onError: (error: Error) => {
            setStatus('error')
            console.error('Add to cart error:', error)
            options.onError?.(error)

            setTimeout(() => {
                setStatus('idle')
            }, resetDelay)
        }
    })

    const addToCart = useCallback((
        productId: string,
        variantId?: string | null,
        quantity: number = 1
    ) => {
        mutation.mutate({ productId, variantId, quantity })
    }, [mutation])

    const buyNow = useCallback(async (
        productId: string,
        variantId?: string | null,
        quantity: number = 1
    ) => {
        setStatus('adding')
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, variantId, quantity })
            })

            if (res.status === 401) {
                router.push('/user/login?callbackUrl=/cart')
                return
            }

            if (!res.ok) {
                throw new Error('Failed to add to cart')
            }

            await queryClient.invalidateQueries({ queryKey: ['cart'] })
            router.push('/cart')
        } catch (error) {
            setStatus('error')
            console.error('Buy now error:', error)
            setTimeout(() => setStatus('idle'), resetDelay)
        }
    }, [queryClient, router, resetDelay])

    const reset = useCallback(() => {
        setStatus('idle')
    }, [])

    return {
        addToCart,
        buyNow,
        status,
        isAdding: status === 'adding',
        isAdded: status === 'added',
        isError: status === 'error',
        reset
    }
}

'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// Types
export interface WishlistProduct {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number | null
    images: { url: string; alt?: string | null }[]
    categories: { category: { id: string; name: string; slug: string } }[]
}

export interface WishlistItem {
    id: string
    userId: string
    productId: string
    createdAt: string
    product: WishlistProduct
}

interface UseWishlistOptions {
    onRemoveSuccess?: () => void
    onRemoveError?: (error: Error) => void
    onMoveToCartSuccess?: () => void
    onMoveToCartError?: (error: Error) => void
}

export function useWishlist(options: UseWishlistOptions = {}) {
    const queryClient = useQueryClient()
    const router = useRouter()

    // ═══════════════════════════════════════════════════════════════
    // QUERY: Fetch wishlist items
    // ═══════════════════════════════════════════════════════════════
    const {
        data: items = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<WishlistItem[]>({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const res = await fetch('/api/wishlist')
            if (!res.ok) {
                if (res.status === 401) {
                    return []
                }
                throw new Error('Failed to fetch wishlist')
            }
            const json = await res.json()
            return Array.isArray(json) ? json : (json.data || [])
        },
        staleTime: 60 * 1000, // 60 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        retry: 1,
    })

    // ═══════════════════════════════════════════════════════════════
    // MUTATION: Remove item from wishlist
    // ═══════════════════════════════════════════════════════════════
    const removeMutation = useMutation({
        mutationFn: async (productId: string) => {
            const res = await fetch(`/api/wishlist/${productId}`, {
                method: 'DELETE'
            })
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/user/login?callbackUrl=/wishlist')
                    throw new Error('Please login to manage wishlist')
                }
                throw new Error('Failed to remove from wishlist')
            }
            return res.json()
        },
        // Optimistic update
        onMutate: async (productId: string) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['wishlist'] })

            // Snapshot previous value
            const previousItems = queryClient.getQueryData<WishlistItem[]>(['wishlist'])

            // Optimistically remove item
            queryClient.setQueryData<WishlistItem[]>(['wishlist'], (old = []) => {
                return old.filter(item => item.product?.id !== productId)
            })

            return { previousItems }
        },
        onError: (err, productId, context) => {
            // Rollback on error
            if (context?.previousItems) {
                queryClient.setQueryData(['wishlist'], context.previousItems)
            }
            options.onRemoveError?.(err as Error)
        },
        onSuccess: () => {
            options.onRemoveSuccess?.()
        },
        onSettled: () => {
            // Always refetch to ensure sync
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        }
    })

    // ═══════════════════════════════════════════════════════════════
    // MUTATION: Move item to cart
    // ═══════════════════════════════════════════════════════════════
    const moveToCartMutation = useMutation({
        mutationFn: async ({ productId, variantId }: { productId: string; variantId?: string }) => {
            // First add to cart
            const cartRes = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, variantId, quantity: 1 })
            })

            if (!cartRes.ok) {
                if (cartRes.status === 401) {
                    router.push('/user/login?callbackUrl=/wishlist')
                    throw new Error('Please login to add to cart')
                }
                throw new Error('Failed to add to cart')
            }

            // Then remove from wishlist
            const wishlistRes = await fetch(`/api/wishlist/${productId}`, {
                method: 'DELETE'
            })

            if (!wishlistRes.ok) {
                throw new Error('Failed to remove from wishlist')
            }

            return { cartRes: await cartRes.json() }
        },
        onMutate: async ({ productId }) => {
            await queryClient.cancelQueries({ queryKey: ['wishlist'] })
            const previousItems = queryClient.getQueryData<WishlistItem[]>(['wishlist'])

            // Optimistically remove from wishlist
            queryClient.setQueryData<WishlistItem[]>(['wishlist'], (old = []) => {
                return old.filter(item => item.product?.id !== productId)
            })

            return { previousItems }
        },
        onError: (err, variables, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(['wishlist'], context.previousItems)
            }
            options.onMoveToCartError?.(err as Error)
        },
        onSuccess: () => {
            // Invalidate both cart and wishlist
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
            options.onMoveToCartSuccess?.()
        }
    })

    // ═══════════════════════════════════════════════════════════════
    // MUTATION: Add item to wishlist
    // ═══════════════════════════════════════════════════════════════
    const addMutation = useMutation({
        mutationFn: async (productId: string) => {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            })

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/user/login?callbackUrl=' + window.location.pathname)
                    throw new Error('Please login to add to wishlist')
                }
                throw new Error('Failed to add to wishlist')
            }

            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
        onError: () => {
            // Error handling via options callback
        }
    })

    // ═══════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    const removeItem = useCallback((productId: string) => {
        removeMutation.mutate(productId)
    }, [removeMutation])

    const moveToCart = useCallback((productId: string, variantId?: string) => {
        moveToCartMutation.mutate({ productId, variantId })
    }, [moveToCartMutation])

    const addItem = useCallback((productId: string) => {
        addMutation.mutate(productId)
    }, [addMutation])

    const hasItem = useCallback((productId: string) => {
        return items.some(item => item.product?.id === productId)
    }, [items])

    const toggleItem = useCallback((productId: string) => {
        if (hasItem(productId)) {
            removeItem(productId)
        } else {
            addItem(productId)
        }
    }, [hasItem, removeItem, addItem])

    // ═══════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════
    return {
        // Query state
        items,
        isLoading,
        isError,
        error: error as Error | null,
        isEmpty: items.length === 0,
        itemCount: items.length,

        // Mutations
        removeItem,
        moveToCart,
        addItem,
        toggleItem,

        // Mutation states
        isRemoving: removeMutation.isPending,
        isMovingToCart: moveToCartMutation.isPending,
        isAdding: addMutation.isPending,
        removingProductId: removeMutation.variables,
        movingProductId: moveToCartMutation.variables?.productId,

        // Utilities
        refetch,
        hasItem,
    }
}

// Export type for external use
export type UseWishlistReturn = ReturnType<typeof useWishlist>

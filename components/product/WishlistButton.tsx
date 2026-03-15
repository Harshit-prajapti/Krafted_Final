'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
    productId: string
    isWishlisted?: boolean
    className?: string
}

export default function WishlistButton({ productId, isWishlisted = false, className }: WishlistButtonProps) {
    const router = useRouter()
    const [active, setActive] = useState(isWishlisted)
    const [loading, setLoading] = useState(false)

    // Sync with prop if it changes (optional but good for SSR alignment details)
    useEffect(() => {
        setActive(isWishlisted)
    }, [isWishlisted])

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if inside a link
        e.stopPropagation()

        if (loading) return

        // Optimistic UI update
        const previousState = active
        setActive(!active)
        setLoading(true)

        try {
            if (active) {
                // Remove
                const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
                if (!res.ok) throw new Error('Failed to remove')
            } else {
                // Add
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    body: JSON.stringify({ productId })
                })
                if (res.status === 401) {
                    router.push('/login')
                    return
                }
                if (!res.ok) throw new Error('Failed to add')
            }
            router.refresh() // Refresh to update counts etc elsewhere
        } catch (error) {
            console.error('Wishlist toggle error', error)
            setActive(previousState) // Revert on error
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            size="icon"
            variant="ghost"
            className={cn("rounded-full hover:bg-gold/10 transition-colors", className)}
            onClick={toggleWishlist}
            disabled={loading}
        >
            <Heart
                size={20}
                className={cn("transition-colors", active ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300")}
            />
        </Button>
    )
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartItem from './CartItem'
import { CartItemData, CartResponse } from '@/types/cart'

interface CartListProps {
    items: CartItemData[]
}

export default function CartList({ items }: CartListProps) {
    const queryClient = useQueryClient()

    const calculateSubtotal = (items: CartItemData[], updatedItemId?: string, newQuantity?: number) => {
        return items.reduce((acc, item) => {
            const quantity = item.id === updatedItemId ? newQuantity! : item.quantity
            const price = item.variant?.price ? Number(item.variant.price) : Number(item.product.basePrice)
            return acc + (price * quantity)
        }, 0)
    }

    const calculateItemCount = (items: CartItemData[], updatedItemId?: string, newQuantity?: number) => {
        return items.reduce((acc, item) => {
            const quantity = item.id === updatedItemId ? newQuantity! : item.quantity
            return acc + quantity
        }, 0)
    }

    const updateQuantityMutation = useMutation({
        mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
            const res = await fetch('/api/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, quantity }),
            })
            if (!res.ok) throw new Error('Failed to update quantity')
            return res.json()
        },
        onMutate: async ({ itemId, quantity }) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] })
            const previousCart = queryClient.getQueryData<CartResponse>(['cart'])

            queryClient.setQueryData<CartResponse>(['cart'], (old) => {
                if (!old) return old
                const updatedItems = old.items.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
                return {
                    ...old,
                    items: updatedItems,
                    subtotal: calculateSubtotal(updatedItems),
                    itemCount: calculateItemCount(updatedItems),
                }
            })

            return { previousCart }
        },
        onError: (err, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], context.previousCart)
            }
            console.error('Failed to update quantity:', err)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })

    const removeItemMutation = useMutation({
        mutationFn: async (itemId: string) => {
            const res = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId }),
            })
            if (!res.ok) throw new Error('Failed to remove item')
            return res.json()
        },
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] })
            const previousCart = queryClient.getQueryData<CartResponse>(['cart'])

            queryClient.setQueryData<CartResponse>(['cart'], (old) => {
                if (!old) return old
                const removedItem = old.items.find(i => i.id === itemId)
                const updatedItems = old.items.filter(item => item.id !== itemId)
                return {
                    ...old,
                    items: updatedItems,
                    subtotal: calculateSubtotal(updatedItems),
                    itemCount: old.itemCount - (removedItem?.quantity || 0),
                }
            })

            return { previousCart }
        },
        onError: (err, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], context.previousCart)
            }
            console.error('Failed to remove item:', err)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return
        updateQuantityMutation.mutate({ itemId, quantity: newQuantity })
    }

    const handleRemoveItem = (itemId: string) => {
        removeItemMutation.mutate(itemId)
    }

    const isUpdating = updateQuantityMutation.isPending || removeItemMutation.isPending

    return (
        <div className="divide-y divide-gray-100">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="py-6 first:pt-0 last:pb-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <CartItem
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        isUpdating={isUpdating}
                    />
                </div>
            ))}
        </div>
    )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface OrderStatusSelectProps {
    orderId: string
    currentStatus: string
}

const STATUS_OPTIONS = [
    { label: 'Created', value: 'CREATED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
]

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const [status, setStatus] = useState(currentStatus)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        setStatus(newStatus)
        setIsUpdating(true)

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) {
                alert('Failed to update status')
                setStatus(currentStatus) // revert
            } else {
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
            setStatus(currentStatus)
        } finally {
            setIsUpdating(false)
        }
    }

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'CREATED': return 'text-gray-600'
            case 'CONFIRMED': return 'text-blue-600'
            case 'SHIPPED': return 'text-yellow-600'
            case 'DELIVERED': return 'text-green-600'
            case 'CANCELLED': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <div className="relative inline-block w-full">
            <select
                value={status}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className={`
                    block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none font-medium
                    ${getStatusColor(status)}
                    ${isUpdating ? 'opacity-50' : ''}
                `}
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {isUpdating && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                </div>
            )}
        </div>
    )
}

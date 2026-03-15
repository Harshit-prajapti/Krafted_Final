"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, User, Phone, Home } from "lucide-react"

interface AddressFormProps {
    callbackUrl?: string
}

export default function AddressForm({ callbackUrl = "/profile/addresses" }: AddressFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        zipCode: "",
        country: "India",
        type: "BOTH" as "SHIPPING" | "BILLING" | "BOTH",
        isDefault: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.phone ||
            !formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode) {
            setError("Please fill in all required fields")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/users/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Failed to add address')
                return
            }

            router.push(callbackUrl)
            router.refresh()
        } catch (err) {
            console.error(err)
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        First Name *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                            placeholder="John"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Last Name *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                            placeholder="Doe"
                        />
                    </div>
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number *
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                        placeholder="+91 1234567890"
                    />
                </div>
            </div>

            {/* Address Line 1 */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Address Line 1 *
                </label>
                <div className="relative">
                    <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                        placeholder="Street address, P.O. box"
                    />
                </div>
            </div>

            {/* Address Line 2 */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Address Line 2
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                </div>
            </div>

            {/* City, State, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        City *
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                        placeholder="Mumbai"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        State *
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                        placeholder="Maharashtra"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Postal Code *
                    </label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                        placeholder="400001"
                    />
                </div>
            </div>

            {/* Address Type */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Address Type
                </label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a24d] focus:border-transparent"
                >
                    <option value="BOTH">Both Shipping & Billing</option>
                    <option value="SHIPPING">Shipping Only</option>
                    <option value="BILLING">Billing Only</option>
                </select>
            </div>

            {/* Default Address */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#c9a24d] focus:ring-[#c9a24d] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-semibold text-gray-700">
                    Set as default address
                </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-[#c9a24d] hover:bg-[#d6b45a] text-white font-bold rounded-xl"
                >
                    {isLoading ? "Saving..." : "Save Address"}
                </Button>
                <Button
                    type="button"
                    onClick={() => router.back()}
                    variant="outline"
                    className="flex-1 h-12 border-2 border-gray-200 hover:bg-gray-50 font-bold rounded-xl"
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}

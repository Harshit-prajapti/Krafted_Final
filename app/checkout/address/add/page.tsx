'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Home, Briefcase, User, Phone, Building2, MapPinned, Loader2, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
]

export default function AddAddressPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/checkout'

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [addressType, setAddressType] = useState<'HOME' | 'OFFICE'>('HOME')
    const [isDefault, setIsDefault] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    type: addressType,
                    isDefault,
                    country: 'India'
                })
            })

            if (res.ok) {
                router.push(callbackUrl)
                router.refresh()
            } else {
                alert('Failed to save address. Please try again.')
            }
        } catch (error) {
            alert('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        href={callbackUrl}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Checkout
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-gray-900">Add New Address</h1>
                            <p className="text-gray-500 text-sm">Enter your delivery address details</p>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100"
                >
                    {/* Address Type Selector */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Address Type</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setAddressType('HOME')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all ${addressType === 'HOME'
                                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-bold">Home</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAddressType('OFFICE')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all ${addressType === 'OFFICE'
                                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                <Briefcase className="w-5 h-5" />
                                <span className="font-bold">Office</span>
                            </button>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <User className="inline w-4 h-4 mr-1 text-gray-400" />
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="John"
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Doe"
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <Phone className="inline w-4 h-4 mr-1 text-gray-400" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91 12345 67890"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Address Lines */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <Building2 className="inline w-4 h-4 mr-1 text-gray-400" />
                            Address Line 1
                        </label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            required
                            placeholder="House/Flat No., Building Name, Street"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            placeholder="Landmark, Area"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* City, State, Postal */}
                    <div className="grid md:grid-cols-3 gap-5 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <MapPinned className="inline w-4 h-4 mr-1 text-gray-400" />
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                placeholder="Mumbai"
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 bg-white"
                            >
                                <option value="">Select</option>
                                {INDIAN_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                                placeholder="400001"
                                maxLength={6}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${isDefault
                                        ? 'bg-amber-500 border-amber-500'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onClick={() => setIsDefault(!isDefault)}
                            >
                                {isDefault && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Set as default address</p>
                                <p className="text-sm text-gray-500">Use this address for future orders</p>
                            </div>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-4 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Save Address
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    )
}

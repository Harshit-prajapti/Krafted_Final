'use client'

import { MapPin, Plus, Check, Home, Briefcase, Edit2, Phone, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface AddressSelectionProps {
    addresses: any[]
    selectedId: string | null
    onSelect: (id: string) => void
    onNext: () => void
}

export default function AddressSelection({ addresses, selectedId, onSelect, onNext }: AddressSelectionProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Address</h2>
                        <p className="text-gray-500 font-medium mt-1">Where should we deliver your furniture?</p>
                    </div>
                    <Link
                        href="/profile/addresses/add?callbackUrl=/checkout"
                        className="flex items-center gap-2 text-sm font-bold text-white bg-black px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        Add New
                    </Link>
                </div>

                {addresses.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                            <MapPin className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-bold text-lg mb-2">No saved addresses</p>
                        <p className="text-gray-400 text-sm mb-6">Add a delivery address to continue</p>
                        <Link
                            href="/profile/addresses/add?callbackUrl=/checkout"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Add Address
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((addr) => {
                            const isSelected = selectedId === addr.id
                            return (
                                <div
                                    key={addr.id}
                                    onClick={() => onSelect(addr.id)}
                                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${isSelected
                                            ? 'border-black bg-gradient-to-br from-gray-50 to-white shadow-xl ring-2 ring-black/5'
                                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl transition-all ${isSelected
                                                    ? 'bg-black text-white shadow-lg'
                                                    : 'bg-white text-gray-400 border border-gray-100 group-hover:border-gray-200'
                                                }`}>
                                                {addr.type === 'HOME' ? <Home className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <p className="font-black text-gray-900 text-lg">{addr.fullName}</p>
                                                    {addr.isDefault && (
                                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 font-medium">{addr.addressLine1}</p>
                                                {addr.addressLine2 && (
                                                    <p className="text-gray-500 text-sm">{addr.addressLine2}</p>
                                                )}
                                                <p className="text-gray-500 text-sm">
                                                    {addr.city}, {addr.state} {addr.postalCode}
                                                </p>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm pt-1">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {addr.phone}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/profile/addresses/${addr.id}/edit?callbackUrl=/checkout`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Link>

                                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'border-green-500 bg-green-500 shadow-lg shadow-green-200'
                                                    : 'border-gray-300'
                                                }`}>
                                                {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    disabled={!selectedId}
                    onClick={onNext}
                    className="group flex items-center gap-3 px-10 py-5 bg-black text-white text-lg font-black rounded-2xl shadow-xl hover:bg-gray-800 hover:shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    Continue to Payment
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}

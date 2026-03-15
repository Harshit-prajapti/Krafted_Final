"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

import { Suspense } from "react"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [validating, setValidating] = useState(true)
    const [tokenValid, setTokenValid] = useState(false)

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token")
            setValidating(false)
            return
        }

        // Validate token
        const validateToken = async () => {
            try {
                const res = await fetch('/api/auth/validate-reset-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                })

                if (res.ok) {
                    setTokenValid(true)
                } else {
                    setError("This reset link is invalid or has expired")
                }
            } catch (err) {
                setError("Failed to validate reset link")
            } finally {
                setValidating(false)
            }
        }

        validateToken()
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!password || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to reset password')
                return
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/user/login')
            }, 3000)
        } catch (err) {
            console.error(err)
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (validating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a24d]"></div>
            </div>
        )
    }

    if (!tokenValid) {
        return (
            <div className="relative min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-red-100 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                                <AlertCircle className="h-20 w-20 text-red-500 relative" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 mb-3">Invalid Link</h1>
                        <p className="text-gray-600 mb-8">{error}</p>

                        <Button
                            onClick={() => router.push('/auth/forgot-password')}
                            className="w-full h-12 bg-[#c9a24d] hover:bg-[#d6b45a] text-white font-bold rounded-xl"
                        >
                            Request New Link
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                                <CheckCircle2 className="h-20 w-20 text-green-500 relative" />
                            </div>
                        </motion.div>

                        <h1 className="text-3xl font-black text-gray-900 mb-3">Password Reset!</h1>
                        <p className="text-gray-600 mb-8">
                            Your password has been successfully reset. Redirecting to login...
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen bg-[#0b0b0b] pt-36 pb-28 px-4 flex justify-center items-start">
            {/* Background */}
            <div
                className="absolute inset-0 opacity-130"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 bg-black/75" />

            {/* Form Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-[#141414]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl px-7 py-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
                    {/* Heading */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-white tracking-wide">
                            Reset Password
                        </h1>
                        <p className="text-xs text-gray-400 mt-2">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                            <p className="text-xs text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* New Password */}
                        <div className="mb-4">
                            <label className="block text-xs text-gray-400 mb-2 font-medium">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="w-full h-10 pl-9 pr-9 rounded-md
                                        bg-[#0f0f0f] border border-[#2a2a2a]
                                        text-sm text-white focus:border-[#c9a24d] outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-[#c9a24d]"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="block text-xs text-gray-400 mb-2 font-medium">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="w-full h-10 pl-9 pr-9 rounded-md
                                        bg-[#0f0f0f] border border-[#2a2a2a]
                                        text-sm text-white focus:border-[#c9a24d] outline-none"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-[#c9a24d]"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 bg-[#c9a24d] text-black
                                hover:bg-[#d6b45a] font-medium text-sm disabled:opacity-50"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a24d]"></div></div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}

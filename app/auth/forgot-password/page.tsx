"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) {
            setError("Please enter your email address")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to send reset email')
                return
            }

            setSuccess(true)
        } catch (err) {
            console.error(err)
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
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

                        <h1 className="text-3xl font-black text-gray-900 mb-3">Check Your Email</h1>
                        <p className="text-gray-600 mb-6">
                            We've sent password reset instructions to <span className="font-bold text-[#c9a24d]">{email}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-8">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push('/user/login')}
                                className="w-full h-12 bg-[#c9a24d] hover:bg-[#d6b45a] text-white font-bold rounded-xl"
                            >
                                Back to Login
                            </Button>
                            <Button
                                onClick={() => setSuccess(false)}
                                variant="outline"
                                className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 font-bold rounded-xl"
                            >
                                Try Different Email
                            </Button>
                        </div>
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
                    {/* Back Button */}
                    <Link
                        href="/user/login"
                        className="flex items-center gap-2 text-gray-400 hover:text-[#c9a24d] transition-colors mb-6"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-sm font-medium">Back to Login</span>
                    </Link>

                    {/* Heading */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-white tracking-wide">
                            Forgot Password?
                        </h1>
                        <p className="text-xs text-gray-400 mt-2">
                            No worries! Enter your email and we'll send you reset instructions.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                            <p className="text-xs text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="mb-6">
                            <label className="block text-xs text-gray-400 mb-2 font-medium">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full h-10 pl-9 pr-3 rounded-md
                                        bg-[#0f0f0f] border border-[#2a2a2a]
                                        text-sm text-white focus:border-[#c9a24d] outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 bg-[#c9a24d] text-black
                                hover:bg-[#d6b45a] font-medium text-sm disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Remember your password?
                        <Link href="/user/login" className="ml-1 text-[#c9a24d] hover:underline font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

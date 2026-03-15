"use client"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Suspense } from "react"

function AuthSuccessContent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [countdown, setCountdown] = useState(5)

    const callbackUrl = searchParams.get("callbackUrl") || "/"

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/user/login")
        }
    }, [status, router])

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push(callbackUrl)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router, callbackUrl])

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a24d]"></div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            {/* Success Icon */}
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

            {/* Welcome Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    Welcome Back!
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                    Hi <span className="text-[#c9a24d] font-bold">{session.user.name}</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    You've successfully logged in to your account
                </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
            >
                <Button
                    onClick={() => router.push("/")}
                    className="w-full h-14 bg-[#c9a24d] hover:bg-[#d6b45a] text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all group"
                >
                    <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Continue Shopping
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                    onClick={() => router.push("/cart")}
                    variant="outline"
                    className="w-full h-14 border-2 border-gray-200 hover:border-[#c9a24d] hover:bg-gray-50 text-gray-900 font-bold text-base rounded-xl transition-all group"
                >
                    <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    View Cart
                </Button>
            </motion.div>

            {/* Auto Redirect Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
            >
                <p className="text-xs text-gray-400">
                    Redirecting in <span className="font-bold text-[#c9a24d]">{countdown}</span> seconds...
                </p>
            </motion.div>
        </div>
    )
}

export default function AuthSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <AuthSuccessContent />
                </Suspense>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#c9a24d]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
                </div>
            </motion.div>
        </div>
    )
}

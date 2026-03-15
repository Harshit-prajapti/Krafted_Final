"use client"
import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
        title: "Server Configuration Error",
        description: "There's a problem with the server configuration. Please contact support.",
    },
    AccessDenied: {
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
    },
    Verification: {
        title: "Verification Failed",
        description: "The verification link has expired or is invalid.",
    },
    OAuthSignin: {
        title: "OAuth Sign-in Error",
        description: "There was a problem signing in with your OAuth provider.",
    },
    OAuthCallback: {
        title: "OAuth Callback Error",
        description: "There was a problem processing the OAuth callback.",
    },
    OAuthCreateAccount: {
        title: "Account Creation Failed",
        description: "Could not create an account with the OAuth provider.",
    },
    EmailCreateAccount: {
        title: "Email Account Creation Failed",
        description: "Could not create an account with your email.",
    },
    Callback: {
        title: "Callback Error",
        description: "There was a problem during the authentication callback.",
    },
    OAuthAccountNotLinked: {
        title: "Account Not Linked",
        description: "This email is already associated with another account. Please sign in using your original method.",
    },
    EmailSignin: {
        title: "Email Sign-in Error",
        description: "There was a problem sending the sign-in email.",
    },
    CredentialsSignin: {
        title: "Invalid Credentials",
        description: "The email or password you entered is incorrect. Please try again.",
    },
    SessionRequired: {
        title: "Session Required",
        description: "You must be signed in to access this page.",
    },
    Default: {
        title: "Authentication Error",
        description: "An unexpected error occurred during authentication. Please try again.",
    },
}

import { Suspense } from "react"

function AuthErrorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams.get("error") || "Default"

    const errorInfo = errorMessages[error] || errorMessages.Default

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-red-100">
            {/* Error Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                    <AlertCircle className="h-20 w-20 text-red-500 relative" />
                </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    Oops!
                </h1>
                <h2 className="text-xl font-bold text-red-600 mb-3">
                    {errorInfo.title}
                </h2>
                <p className="text-base text-gray-600 leading-relaxed">
                    {errorInfo.description}
                </p>
            </motion.div>

            {/* Error Code */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6"
            >
                <p className="text-xs text-red-600 font-mono text-center">
                    Error Code: <span className="font-bold">{error}</span>
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
                    onClick={() => router.push("/user/login")}
                    className="w-full h-14 bg-[#c9a24d] hover:bg-[#d6b45a] text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all group"
                >
                    <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    Try Again
                </Button>

                <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="w-full h-14 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 font-bold text-base rounded-xl transition-all group"
                >
                    <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Button>
            </motion.div>

            {/* Help Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
            >
                <p className="text-xs text-gray-500">
                    Need help?{" "}
                    <a href="/contact" className="text-[#c9a24d] hover:underline font-semibold">
                        Contact Support
                    </a>
                </p>
            </motion.div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <Suspense fallback={<div className="text-center">Loading error details...</div>}>
                    <AuthErrorContent />
                </Suspense>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
                </div>
            </motion.div>
        </div>
    )
}

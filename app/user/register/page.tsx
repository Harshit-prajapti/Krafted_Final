"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Phone } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true"

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#c9a24d" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#bfa24a" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" fill="#d4af37" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#a88b2d" />
    </svg>
)

export default function RegisterPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleRegister = async () => {
        setError("")

        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError("Please fill in all required fields")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone: phone || undefined,
                    password,
                    confirmPassword
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Registration failed')
                return
            }

            // Registration successful, redirect to login
            alert('Registration successful! Please login.')
            router.push('/user/login')

        } catch (err) {
            console.error(err)
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
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

            {/* Register Card */}
            <div className="relative w-full max-w-md">
                <div
                    className="bg-[#141414]/95 backdrop-blur-xl
          border border-[#2a2a2a]
          rounded-xl px-7 py-8
          shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
                >
                    {/* Heading */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-white tracking-wide">
                            Create Account
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            Join us for luxury furniture shopping
                        </p>
                    </div>

                    {/* Google */}
                    {googleAuthEnabled && (
                        <>
                            <button
                                className="w-full h-10 mb-5 flex items-center justify-center
            rounded-md border border-[#3a3a3a]
            bg-[#101010] text-gray-300 text-sm
            hover:border-[#c9a24d] hover:text-[#c9a24d]
            transition"
                                onClick={() => signIn("google")}
                            >
                                <GoogleIcon />
                                Sign up with Google
                            </button>

                            {/* Divider */}
                            <div className="flex items-center mb-5">
                                <span className="flex-1 border-t border-white/10" />
                                <span className="px-3 text-[11px] text-gray-500">OR</span>
                                <span className="flex-1 border-t border-white/10" />
                            </div>
                        </>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                            <p className="text-xs text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="mb-4">
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Full Name *"
                                className="w-full h-10 pl-9 pr-3 rounded-md
                bg-[#0f0f0f] border border-[#2a2a2a]
                text-sm text-white focus:border-[#c9a24d] outline-none"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="email"
                                placeholder="Email *"
                                className="w-full h-10 pl-9 pr-3 rounded-md
                bg-[#0f0f0f] border border-[#2a2a2a]
                text-sm text-white focus:border-[#c9a24d] outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="tel"
                                placeholder="Phone (Optional)"
                                className="w-full h-10 pl-9 pr-3 rounded-md
                bg-[#0f0f0f] border border-[#2a2a2a]
                text-sm text-white focus:border-[#c9a24d] outline-none"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password *"
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
                    <div className="mb-5">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password *"
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
                        className="w-full h-10 bg-[#c9a24d] text-black
            hover:bg-[#d6b45a] font-medium text-sm disabled:opacity-50"
                        onClick={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Already have an account?
                        <a href="/user/login" className="ml-1 text-[#c9a24d] hover:underline">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff, ChevronRight, Sparkles, Home, Palette, Heart, CheckCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#c9a24d" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#bfa24a" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" fill="#d4af37" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#a88b2d" />
    </svg>
);

const engagementQuestions = [
    {
        icon: Home,
        question: "What room are you looking to furnish?",
        options: ["Living Room", "Bedroom", "Dining Room", "Office", "Multiple Rooms"]
    },
    {
        icon: Palette,
        question: "What's your preferred style?",
        options: ["Modern & Minimal", "Classic & Traditional", "Rustic & Natural", "Luxurious & Royal", "Mix of Everything"]
    },
    {
        icon: Heart,
        question: "What matters most to you?",
        options: ["Quality & Durability", "Design & Aesthetics", "Comfort & Coziness", "Value for Money", "Eco-Friendly"]
    }
];

export default function LoginPopup() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Flow state: 'questions' -> 'login'
    const [step, setStep] = useState<'questions' | 'login'>('questions');

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

    useEffect(() => {
        if (pathname !== "/" || status === "loading") return;

        const alreadyShown = sessionStorage.getItem("loginPopupShown");
        if (alreadyShown || session) {
            setHasShown(true);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
            setHasShown(true);
            sessionStorage.setItem("loginPopupShown", "true");
        }, 10000);

        return () => clearTimeout(timer);
    }, [pathname, session, status]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleGoogleSignIn = async () => {
        if (!googleAuthEnabled) return;
        setError("");
        await signIn("google", { redirect: false });
        handleClose();
    };

    const handleCredentialsSignIn = async () => {
        setError("");

        const result = await signIn("credentials", {
            email: email.trim().toLowerCase(),
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Sign in failed. Please check your email and password.");
            return;
        }

        handleClose();
    };

    const handleAnswerSelect = (answer: string) => {
        const newAnswers = [...selectedAnswers, answer];
        setSelectedAnswers(newAnswers);

        if (currentQuestion < engagementQuestions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(prev => prev + 1);
            }, 300);
        } else {
            // Transition to Login after last question
            setTimeout(() => {
                setStep('login');
            }, 300);
        }
    };

    if (pathname !== "/" || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            >
                <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={handleClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md bg-[#141414]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden"
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                    >
                        <X size={18} />
                    </button>

                    <AnimatePresence mode="wait">
                        {step === 'questions' ? (
                            <motion.div
                                key="engagement"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <div className="mb-6 text-center">
                                    <div className="flex justify-center gap-2 mb-3">
                                        {React.createElement(engagementQuestions[currentQuestion].icon, {
                                            className: "w-6 h-6 text-amber-500"
                                        })}
                                    </div>
                                    <h2 className="text-xl font-semibold text-white tracking-wide">
                                        Help Us Help You
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Question {currentQuestion + 1} of {engagementQuestions.length}
                                    </p>
                                </div>

                                <div className="mb-2 flex gap-1">
                                    {engagementQuestions.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 h-1 rounded-full transition-all ${i <= currentQuestion ? "bg-amber-500" : "bg-gray-700"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <motion.div
                                    key={currentQuestion}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6"
                                >
                                    <h3 className="text-lg text-white font-medium mb-4 text-center">
                                        {engagementQuestions[currentQuestion].question}
                                    </h3>

                                    <div className="space-y-2">
                                        {engagementQuestions[currentQuestion].options.map((option, i) => (
                                            <motion.button
                                                key={option}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                onClick={() => handleAnswerSelect(option)}
                                                className="w-full p-3 flex items-center justify-between rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-gray-300 text-sm hover:border-amber-500 hover:text-amber-500 transition-all group"
                                            >
                                                <span>{option}</span>
                                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <div className="mb-6 text-center">
                                    <div className="flex justify-center gap-2 mb-3">
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                        <span className="text-amber-500 text-xs uppercase tracking-widest">Welcome Back</span>
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                                        Sign In to Krafted
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Unlock exclusive deals & personalized recommendations
                                    </p>
                                </div>

                                {googleAuthEnabled && (
                                    <>
                                        <button
                                            className="w-full h-11 mb-5 flex items-center justify-center rounded-xl border border-[#3a3a3a] bg-[#101010] text-gray-300 text-sm hover:border-[#c9a24d] hover:text-[#c9a24d] transition"
                                            onClick={handleGoogleSignIn}
                                        >
                                            <GoogleIcon />
                                            Continue with Google
                                        </button>

                                        <div className="flex items-center mb-5">
                                            <span className="flex-1 border-t border-white/10" />
                                            <span className="px-3 text-[11px] text-gray-500">OR</span>
                                            <span className="flex-1 border-t border-white/10" />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-4">
                                    {error && (
                                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                                            <p className="text-xs text-red-300">{error}</p>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-sm text-white focus:border-[#c9a24d] outline-none transition-colors"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-sm text-white focus:border-[#c9a24d] outline-none transition-colors"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3.5 text-gray-400 hover:text-[#c9a24d]"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCredentialsSignIn}
                                    className="w-full h-11 mt-5 bg-gradient-to-r from-[#c9a24d] to-[#d6b45a] text-black font-semibold text-sm rounded-xl hover:from-[#d6b45a] hover:to-[#e0c26a] transition-all shadow-lg"
                                >
                                    Sign In
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-5">
                                    New here?{" "}
                                    <a href="/user/register" className="text-[#c9a24d] hover:underline">
                                        Create account
                                    </a>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

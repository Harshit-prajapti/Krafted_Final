'use client'

import { motion, Variants } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useMemo } from 'react'

interface PageHeaderProps {
    badge?: string
    title: string
    subtitle?: string
    variant?: 'light' | 'dark' | 'gradient'
    showSparkles?: boolean
    className?: string
}

// Floating particle component for premium effect
function FloatingParticles({ variant }: { variant: 'light' | 'dark' | 'gradient' }) {
    const particles = useMemo(() =>
        Array.from({ length: 12 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 6 + 4,
            delay: Math.random() * 3,
        })), []
    )

    const particleColor = variant === 'dark' ? 'bg-gold/30' : 'bg-amber-400/30'

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className={`absolute rounded-full ${particleColor}`}
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />  
            ))} */}
        </div>
    )
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        }
    }
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 25,
        filter: 'blur(8px)'
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

export default function PageHeader({
    badge,
    title,
    subtitle,
    variant = 'light',
    showSparkles = true,
    className = ''
}: PageHeaderProps) {
    const bgClasses = {
        light: 'bg-gradient-to-b from-gray-50 to-white',
        dark: 'bg-gradient-to-b from-charcoal-dark to-gray-900',
        gradient: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }

    const textClasses = {
        light: 'text-gray-900',
        dark: 'text-white',
        gradient: 'text-gray-900'
    }

    const subtitleClasses = {
        light: 'text-gray-600',
        dark: 'text-gray-300',
        gradient: 'text-gray-600'
    }

    const badgeClasses = {
        light: 'text-amber-600',
        dark: 'text-gold',
        gradient: 'text-amber-600'
    }

    return (
        <section className={`relative overflow-hidden py-12 md:py-16 ${bgClasses[variant]} ${className}`}>
            <FloatingParticles variant={variant} />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {badge && (
                        <motion.div variants={itemVariants} className="mb-4">
                            <div className="inline-flex items-center gap-2">
                                {showSparkles && <Sparkles className={`w-4 h-4 ${badgeClasses[variant]}`} />}
                                <span className={`uppercase tracking-[0.2em] text-xs md:text-sm font-semibold ${badgeClasses[variant]}`}>
                                    {badge}
                                </span>
                                {showSparkles && <Sparkles className={`w-4 h-4 ${badgeClasses[variant]}`} />}
                            </div>
                        </motion.div>
                    )}

                    <motion.h1
                        variants={itemVariants}
                        className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 tracking-tight ${textClasses[variant]}`}
                    >
                        {title}
                    </motion.h1>

                    {subtitle && (
                        <motion.p
                            variants={itemVariants}
                            className={`text-base md:text-lg max-w-xl mx-auto leading-relaxed ${subtitleClasses[variant]}`}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </motion.div>
            </div>

            {/* Decorative gradient line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            />
        </section>
    )
}

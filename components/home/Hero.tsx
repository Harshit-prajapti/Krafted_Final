"use client"

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
const heroImages = [
    '/images/model.jpeg',
    '/images/house.jpeg',
    '/images/house2.jpeg',
    '/images/house3.jpeg',
    '/images/house4.jpeg',
    '/images/house5.jpeg',
    '/images/house6.jpeg',
    '/images/house7.jpeg',
    '/images/house8.jpeg',
    '/images/house9.jpeg',
]

const kenBurnsVariants = [
    { scale: [1, 1.15], x: ['0%', '2%'], y: ['0%', '1%'] },
    { scale: [1, 1.12], x: ['0%', '-2%'], y: ['0%', '2%'] },
    { scale: [1.05, 1.15], x: ['-1%', '1%'], y: ['1%', '-1%'] },
    { scale: [1, 1.1], x: ['1%', '-1%'], y: ['0%', '1%'] },
    { scale: [1.02, 1.12], x: ['0%', '1.5%'], y: ['-0.5%', '0.5%'] },
]

function FloatingParticles() {
    const particles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 5,
        })), []
    )

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-gold/30"
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        }
    }
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)'
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

const buttonVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
}

export default function Hero() {
    const { t } = useTranslation('home')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, [])

    useEffect(() => {
        setIsMounted(true)
        setIsLoaded(true)
        const interval = setInterval(nextImage, 8000)
        return () => clearInterval(interval)
    }, [nextImage])

    useEffect(() => {
        heroImages.forEach((src) => {
            const img = new window.Image()
            img.src = src
        })
    }, [])

    const currentKenBurns = kenBurnsVariants[currentIndex % kenBurnsVariants.length]

    return (
        <section className="relative h-screen w-full overflow-hidden bg-charcoal-dark flex items-center justify-center">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.7) 100%)'
                    }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                            }}
                            animate={{
                                scale: currentKenBurns.scale,
                                x: currentKenBurns.x,
                                y: currentKenBurns.y,
                            }}
                            transition={{
                                duration: 8,
                                ease: "linear",
                            }}
                        >
                            <Image
                                src={heroImages[currentIndex]}
                                alt="Luxury furniture showcase"
                                fill
                                priority={currentIndex === 0}
                                quality={90}
                                sizes="100vw"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                                unoptimized={false}
                            />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {isMounted && <FloatingParticles />}

                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className="group relative p-1"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <motion.div
                                className={`h-1 rounded-full transition-colors duration-300 ${index === currentIndex
                                    ? 'bg-gold'
                                    : 'bg-white/30 group-hover:bg-white/60'
                                    }`}
                                animate={{
                                    width: index === currentIndex ? 32 : 8,
                                }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            />
                            {index === currentIndex && (
                                <motion.div
                                    className="absolute inset-0 h-1 mt-1 rounded-full bg-gold/40"
                                    layoutId="activeIndicator"
                                    transition={{ duration: 0.4 }}
                                    style={{ filter: 'blur(4px)' }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container relative z-20 px-4 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                >
                    <motion.div variants={itemVariants}>
                        <motion.span
                            className="inline-block text-gold tracking-[0.25em] font-medium mb-6 text-xs md:text-sm uppercase"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            style={{
                                background: 'linear-gradient(90deg, #D4AF37 0%, #F4C430 25%, #D4AF37 50%, #F4C430 75%, #D4AF37 100%)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            ✦ {t('hero.timelessElegance', 'Timeless Elegance')} ✦
                        </motion.span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-6xl lg:text-8xl font-heading font-bold text-white mb-6 leading-tight"
                        variants={itemVariants}
                    >
                        {t('hero.heading_part1', 'Crafting Comfort')} <br />
                        <motion.span
                            className="inline-block italic font-light"
                            style={{
                                background: 'linear-gradient(135deg, #F4C430 0%, #D4AF37 50%, #C5A028 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            {t('hero.heading_part2', 'Into Art')}
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        className="max-w-xl mx-auto text-gray-300 mb-12 text-lg md:text-xl font-light leading-relaxed"
                        variants={itemVariants}
                    >
                        {t('hero.tagline', 'Discover our curated collection of handcrafted furniture designed to elevate your living space.')}
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        variants={itemVariants}
                    >
                        <Link href="/shop">
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Button
                                    variant="luxury"
                                    size="lg"
                                    className="min-w-[200px] text-lg relative overflow-hidden group"
                                >
                                    <span className="relative z-10">{t('hero.cta.shop', 'Shop Collection')}</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-dark"
                                        style={{ backgroundSize: '200% 100%' }}
                                        animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                </Button>
                            </motion.div>
                        </Link>
                        <Link href="/about">
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="min-w-[200px] text-lg border-white/50 text-white hover:bg-white hover:text-black hover:border-white backdrop-blur-sm"
                                >
                                    {t('hero.ourStory', 'Our Story')}
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-3 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{t('hero.scrollToExplore', 'Scroll to Explore')}</span>
                <motion.div
                    className="w-5 h-8 rounded-full border border-gold/40 flex items-start justify-center p-1"
                >
                    <motion.div
                        className="w-1 h-2 rounded-full bg-gold"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}

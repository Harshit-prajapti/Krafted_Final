"use client"

import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'

const DESKTOP_HERO_IMAGE = 'https://pub-6373be2f34c246649e921d2bef6e47c1.r2.dev/web%20cover%20page%20krafted.png'
const MOBILE_HERO_IMAGE = '/images/mobileHero.jpeg'

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
    const [isLoaded, setIsLoaded] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        setIsLoaded(true)
    }, [])

    return (
        <section className="relative mt-[110px] min-h-[calc(100svh-110px)] w-full overflow-hidden bg-charcoal-dark flex items-end justify-center md:mt-[132px] md:min-h-[calc(100svh-132px)] md:items-center">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    className="absolute inset-0 hidden md:block"
                    animate={{
                        x: ['0%', '0.8%'],
                        y: ['0%', '0.8%'],
                    }}
                    transition={{
                        duration: 24,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                >
                    <Image
                        src={DESKTOP_HERO_IMAGE}
                        alt=""
                        fill
                        priority
                        quality={85}
                        sizes="100vw"
                        className="hero-ios-fix object-cover object-center opacity-30 blur-sm"
                        unoptimized
                    />
                </motion.div>

                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.06) 42%, rgba(0,0,0,0.72) 100%)'
                    }}
                />

                <motion.div
                    className="absolute inset-0 hero-animate"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 18 }}
                    transition={{
                        duration: 0.9,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                    <div className="absolute inset-x-0 top-0 bottom-[26%] md:inset-0 md:px-6">
                        <Image
                            src={MOBILE_HERO_IMAGE}
                            alt="Luxury furniture showcase"
                            fill
                            priority
                            quality={90}
                            sizes="100vw"
                            className="hero-ios-fix object-contain object-center md:hidden"
                            unoptimized
                        />
                        <Image
                            src={DESKTOP_HERO_IMAGE}
                            alt="Luxury furniture showcase"
                            fill
                            priority
                            quality={90}
                            sizes="100vw"
                            className="hero-ios-fix hidden object-contain object-center md:block"
                            unoptimized
                        />
                    </div>
                </motion.div>

                {isMounted && <FloatingParticles />}
            </div>

            <div className="container relative z-20 px-4 pb-8 text-center md:pb-0">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                >
                    <motion.div variants={itemVariants}>
                        <motion.span
                        className="inline-block text-gold tracking-[0.28em] font-semibold mb-3 text-[10px] md:mb-4 md:text-sm uppercase"
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
                            ✦ Krafted Furniture ✦
                        </motion.span>
                    </motion.div>

                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-7xl lg:text-9xl font-heading font-extrabold text-white mb-3 md:mb-4 leading-none tracking-tight"
                        variants={itemVariants}
                    >
                        <motion.span
                            className="inline-block"
                            style={{
                                background: 'linear-gradient(135deg, #FFFFFF 0%, #F4C430 40%, #D4AF37 70%, #C5A028 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                textShadow: '0 0 80px rgba(212,175,55,0.3)',
                            }}
                        >
                            QUEEN & KING
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        className="max-w-2xl mx-auto text-white/90 mb-6 text-sm sm:text-base md:mb-10 md:text-2xl lg:text-3xl font-light tracking-[0.12em] uppercase"
                        variants={itemVariants}
                        style={{
                            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        You Deserve The Crown
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
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
                                    className="min-w-[200px] text-base md:text-lg relative overflow-hidden group"
                                >
                                    <span className="relative z-10 text-lg md:text-xl font-bold tracking-widest">ORDER NOW</span>
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
                                    className="min-w-[200px] text-base md:text-lg border-white/50 text-white hover:bg-white hover:text-black hover:border-white backdrop-blur-sm"
                                >
                                    {t('hero.ourStory', 'Our Story')}
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-white/50 flex-col items-center gap-3 z-20 md:flex"
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

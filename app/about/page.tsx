'use client'

import { motion } from 'framer-motion'
import { Sparkles, Award, Users, Heart, Truck, Shield, Hammer, Gem } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function AboutPage() {
    const { t } = useTranslation(['about', 'common'])

    const values = [
        {
            icon: Hammer,
            title: t('values.items.craftsmanship.title', 'Master Craftsmanship'),
            description: t('values.items.craftsmanship.description', 'Each piece is handcrafted by skilled artisans with decades of experience, ensuring exceptional quality in every detail.')
        },
        {
            icon: Gem,
            title: t('values.items.materials.title', 'Premium Materials'),
            description: t('values.items.materials.description', 'We source only the finest sustainable hardwoods, metals, and fabrics from trusted suppliers around the world.')
        },
        {
            icon: Heart,
            title: t('values.items.passion.title', 'Passion for Design'),
            description: t('values.items.passion.description', 'Our designers blend timeless elegance with modern functionality to create furniture that inspires.')
        },
        {
            icon: Shield,
            title: t('values.items.guarantee.title', 'Quality Guarantee'),
            description: t('values.items.guarantee.description', 'Every Krafted piece comes with a 10-year warranty, reflecting our confidence in lasting quality.')
        }
    ]

    const stats = [
        { value: '15+', label: t('stats.experience', 'Years Experience') },
        { value: '10K+', label: t('stats.customers', 'Happy Customers') },
        { value: '500+', label: t('stats.designs', 'Unique Designs') },
        { value: '98%', label: t('stats.satisfaction', 'Satisfaction Rate') }
    ]
    return (
        <div className="min-h-screen bg-white pt-28">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&h=1080&fit=crop)',
                    }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <motion.div
                    className="relative z-10 text-center text-white px-4 max-w-4xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <Sparkles className="text-amber-400 w-6 h-6" />
                        <span className="text-amber-400 uppercase tracking-[0.3em] text-sm font-medium">{t('hero.established', 'Est. 2010')}</span>
                        <Sparkles className="text-amber-400 w-6 h-6" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
                        {t('hero.title', 'Our Story')}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                        {t('hero.tagline', 'Crafting luxury furniture that transforms houses into homes, one masterpiece at a time.')}
                    </p>
                </motion.div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-8 leading-tight">
                                {t('story.title', 'The Birth of Authority')}
                            </h2>
                            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                                {Array.isArray(t('story.paragraphs', { returnObjects: true })) ?
                                    (t('story.paragraphs', { returnObjects: true }) as string[]).map((para, i) => {
                                        const isHighlight = para.includes('KEY KRAFTED ROYALE') || para.includes('claim your throne') || para.includes('Authority');
                                        return (
                                            <p
                                                key={i}
                                                className={`
                                                    ${isHighlight ? "font-semibold text-gray-900" : ""}
                                                    ${para.includes('KEY KRAFTED ROYALE') ? "text-xl" : ""}
                                                `}
                                            >
                                                {para}
                                            </p>
                                        )
                                    }) : (
                                        <p>{t('story.paragraph1')}</p>
                                    )
                                }
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop"
                                    alt="Krafted workshop"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-amber-500 text-white p-6 rounded-2xl shadow-2xl">
                                <p className="text-4xl font-bold font-heading">15+</p>
                                <p className="text-sm uppercase tracking-wider">{t('story.badge', 'Years of Excellence')}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                            {t('values.title', 'Our Core Values')}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('values.subtitle', 'The principles that guide everything we create')}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="w-8 h-8 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <p className="text-4xl md:text-5xl font-bold text-amber-500 font-heading mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-gray-400 uppercase tracking-wider text-sm">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                            {t('cta.title', 'Ready to Transform Your Space?')}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            {t('cta.description', 'Explore our curated collection of handcrafted furniture and find pieces that speak to your soul.')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/shop">
                                <Button variant="luxury" size="lg" className="px-8">
                                    {t('cta.shop', 'Shop Collection')}
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" size="lg" className="px-8 border-2">
                                    {t('cta.contact', 'Contact Us')}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

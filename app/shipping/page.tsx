'use client'

import { motion } from 'framer-motion'
import { Sparkles, Truck, Clock, Globe, MapPin, Package, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function ShippingPage() {
    const { t } = useTranslation(['support', 'common'])

    const deliveryZones = (t('shipping.zones.items', { returnObjects: true }) as any[]) || []

    const features = [
        {
            icon: Truck,
            title: t('shipping.features.whiteGlove.title', 'White Glove Delivery'),
            description: t('shipping.features.whiteGlove.description', 'Our team delivers to your room of choice, unpacks, and assembles your furniture.')
        },
        {
            icon: Shield,
            title: t('shipping.features.insured.title', 'Fully Insured'),
            description: t('shipping.features.insured.description', 'All shipments are fully insured against damage during transit.')
        },
        {
            icon: Clock,
            title: t('shipping.features.scheduling.title', 'Flexible Scheduling'),
            description: t('shipping.features.scheduling.description', 'Choose a delivery date and time slot that works best for you.')
        },
        {
            icon: Package,
            title: t('shipping.features.packaging.title', 'Careful Packaging'),
            description: t('shipping.features.packaging.description', 'Each piece is carefully wrapped with protective materials for safe transit.')
        }
    ]
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white pt-28 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Sparkles className="text-amber-600 w-5 h-5" />
                        <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-medium">{t('shipping.badge', 'Delivery Info')}</span>
                        <Sparkles className="text-amber-600 w-5 h-5" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                        {t('shipping.title', 'Shipping & Delivery')}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t('shipping.tagline', 'We take great care in delivering your furniture safely to your doorstep.')}
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="bg-gray-50 rounded-2xl p-6 text-center"
                        >
                            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <feature.icon className="w-7 h-7 text-amber-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Delivery Zones */}
                <motion.div
                    className="max-w-4xl mx-auto mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('shipping.zones.title', 'Delivery Zones & Timelines')}</h2>
                    <div className="space-y-4">
                        {deliveryZones.map((zone, index) => (
                            <div
                                key={zone.zone}
                                className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-amber-600" />
                                        <h3 className="font-bold text-gray-900">{zone.zone}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm">{zone.cities}</p>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('shipping.zones.deliveryTime', 'Delivery Time')}</p>
                                        <p className="font-semibold text-gray-900">{zone.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('shipping.zones.shippingCost', 'Shipping Cost')}</p>
                                        <p className="font-semibold text-amber-600">{zone.cost}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Shipping Policies */}
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shipping Policies</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Order Processing
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li>• Orders are processed within 2-3 business days</li>
                                <li>• Custom orders may take 4-6 weeks to manufacture</li>
                                <li>• You'll receive tracking info once shipped</li>
                                <li>• SMS and email updates at every stage</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" />
                                International Shipping
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li>• Available to select countries</li>
                                <li>• Delivery time: 2-4 weeks</li>
                                <li>• Customs and duties paid by buyer</li>
                                <li>• Contact us for a shipping quote</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-amber-500" />
                                Delivery Process
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li>• We call to schedule delivery appointment</li>
                                <li>• Team brings furniture to your room of choice</li>
                                <li>• Basic assembly included for most items</li>
                                <li>• We remove all packaging materials</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-500" />
                                Damage Protection
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li>• All items insured during transit</li>
                                <li>• Inspect items before signing</li>
                                <li>• Report damage within 48 hours</li>
                                <li>• Free replacement for transit damage</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="text-gray-600 mb-4">{t('faq.stillQuestions', 'Have questions about shipping?')}</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                    >
                        {t('common:nav.contact', 'Contact Us')}
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}

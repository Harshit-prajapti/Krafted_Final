'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, Sparkles, Crown, Home as HomeIcon, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function ContactPage() {
    const { t } = useTranslation(['contact', 'common'])

    const contactInfo = [
        {
            icon: MapPin,
            title: t('info.showroom.title', 'Visit Our Showroom'),
            lines: t('info.showroom.address', { returnObjects: true }) as string[]
        },
        {
            icon: Phone,
            title: t('info.call', 'Call Us'),
            lines: ['+91 12345 67890', '+91 98765 43210']
        },
        {
            icon: Mail,
            title: t('info.email', 'Email Us'),
            lines: ['contact@krafted.com', 'support@krafted.com']
        },
        {
            icon: Clock,
            title: t('info.hours.title', 'Business Hours'),
            lines: [
                t('info.hours.weekdays', 'Mon - Sat: 10:00 AM - 8:00 PM'),
                t('info.hours.sunday', 'Sunday: 11:00 AM - 6:00 PM')
            ]
        }
    ]

    const royalAdvisors = [
        {
            name: 'Rajesh Sharma',
            role: t('advisory.roles.seniorPurchase', 'Senior Purchase Advisor'),
            phone: '+91 98765 11111',
            email: 'rajesh@krafted.com',
            whatsapp: '919876511111',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
        },
        {
            name: 'Priya Mehta',
            role: t('advisory.roles.luxurySpecialist', 'Luxury Collection Specialist'),
            phone: '+91 98765 22222',
            email: 'priya@krafted.com',
            whatsapp: '919876522222',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
        }
    ]

    const interiorAdvisors = [
        {
            name: 'Arjun Kapoor',
            role: t('interior.roles.leadDesigner', 'Lead Interior Designer'),
            specialty: t('interior.specialties.modern', 'Modern & Contemporary Spaces'),
            phone: '+91 98765 33333',
            email: 'arjun@krafted.com',
            whatsapp: '919876533333',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
        },
        {
            name: 'Sneha Gupta',
            role: t('interior.roles.consultant', 'Interior Design Consultant'),
            specialty: t('interior.specialties.classic', 'Classic & Traditional Interiors'),
            phone: '+91 98765 44444',
            email: 'sneha@krafted.com',
            whatsapp: '919876544444',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
        }
    ]

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })

        setTimeout(() => setIsSubmitted(false), 5000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white pt-28 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Sparkles className="text-amber-600 w-5 h-5" />
                        <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-medium">{t('header.badge', 'Get in Touch')}</span>
                        <Sparkles className="text-amber-600 w-5 h-5" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                        {t('header.title', 'Contact Us')}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t('header.tagline', "Have questions about our furniture or need assistance? We'd love to hear from you.")}
                    </p>
                </motion.div>

                <div className="">

                    <motion.div
                        className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {contactInfo.map((info, index) => (
                            <div
                                key={info.title}
                                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <info.icon className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                                        {info.lines.map((line, i) => (
                                            <p key={i} className="text-gray-600 text-sm">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </motion.div>
                </div>

                {/* Royal Advisory Section */}
                <motion.div
                    className="mt-20 max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="text-center mb-10">
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <Crown className="text-amber-600 w-6 h-6" />
                            <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-medium">{t('advisory.badge', 'Premium Service')}</span>
                            <Crown className="text-amber-600 w-6 h-6" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
                            {t('advisory.title', 'Royal Purchase Advisory')}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('advisory.tagline', 'Get personalized guidance from our expert advisors to find the perfect furniture for your space')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {royalAdvisors.map((advisor, index) => (
                            <motion.div
                                key={advisor.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index }}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <img
                                            src={advisor.image}
                                            alt={advisor.name}
                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900">{advisor.name}</h3>
                                        <p className="text-amber-700 font-medium text-sm">{advisor.role}</p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <a href={`tel:${advisor.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-amber-600 transition-colors group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors shadow-sm">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{advisor.phone}</span>
                                    </a>
                                    <a href={`mailto:${advisor.email}`} className="flex items-center gap-3 text-gray-700 hover:text-amber-600 transition-colors group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors shadow-sm">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{advisor.email}</span>
                                    </a>
                                    <a
                                        href={`https://wa.me/${advisor.whatsapp}?text=Hello! I'm interested in purchasing furniture from Krafted.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors shadow-sm">
                                            <MessageCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="font-medium text-green-600">{t('advisory.whatsapp', 'Chat on WhatsApp')}</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Interior Adviser Section */}
                <motion.div
                    className="mt-20 max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <div className="text-center mb-10">
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <HomeIcon className="text-blue-600 w-6 h-6" />
                            <span className="text-blue-600 uppercase tracking-[0.2em] text-sm font-medium">{t('interior.badge', 'Expert Guidance')}</span>
                            <HomeIcon className="text-blue-600 w-6 h-6" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
                            {t('interior.title', 'Interior Design Advisors')}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('interior.tagline', 'Our interior design experts will help you create the perfect space with curated furniture selections')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {interiorAdvisors.map((advisor, index) => (
                            <motion.div
                                key={advisor.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index }}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <img
                                            src={advisor.image}
                                            alt={advisor.name}
                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-300"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900">{advisor.name}</h3>
                                        <p className="text-blue-700 font-medium text-sm">{advisor.role}</p>
                                        <p className="text-gray-500 text-xs mt-1">{advisor.specialty}</p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <a href={`tel:${advisor.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{advisor.phone}</span>
                                    </a>
                                    <a href={`mailto:${advisor.email}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{advisor.email}</span>
                                    </a>
                                    <a
                                        href={`https://wa.me/${advisor.whatsapp}?text=Hello! I need interior design consultation for my space.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors shadow-sm">
                                            <MessageCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="font-medium text-green-600">{t('advisory.whatsapp', 'Chat on WhatsApp')}</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles, Search, HelpCircle, Package, CreditCard, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

export default function FAQPage() {
    const { t } = useTranslation(['support', 'common'])

    const faqCategories = [
        { id: 'all', name: t('faq.categories.all', 'All Questions'), icon: HelpCircle },
        { id: 'orders', name: t('faq.categories.orders', 'Orders'), icon: Package },
        { id: 'shipping', name: t('faq.categories.shipping', 'Shipping'), icon: Truck },
        { id: 'returns', name: t('faq.categories.returns', 'Returns'), icon: RotateCcw },
        { id: 'payment', name: t('faq.categories.payment', 'Payment'), icon: CreditCard },
        { id: 'warranty', name: t('faq.categories.warranty', 'Warranty'), icon: ShieldCheck },
    ]

    const faqs = (t('faq.questions', { returnObjects: true }) as any[]) || []
    const [activeCategory, setActiveCategory] = useState('all')
    const [openQuestion, setOpenQuestion] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Sparkles className="text-amber-600 w-5 h-5" />
                        <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-medium">{t('faq.badge', 'Help Center')}</span>
                        <Sparkles className="text-amber-600 w-5 h-5" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                        {t('faq.title', 'Frequently Asked Questions')}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t('faq.tagline', 'Find answers to common questions about orders, shipping, returns, and more.')}
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    className="max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('faq.searchPlaceholder', 'Search for answers...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-lg bg-white shadow-sm"
                        />
                    </div>
                </motion.div>

                {/* Category Pills */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {faqCategories.map((category) => {
                        const Icon = category.icon
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${activeCategory === category.id
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {category.name}
                            </button>
                        )
                    })}
                </motion.div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12">
                            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">{t('faq.noResults', 'No questions found matching your search.')}</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                            >
                                <button
                                    onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openQuestion === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openQuestion === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-5 text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Contact CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="text-gray-600 mb-4">{t('faq.stillQuestions', 'Still have questions?')}</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                    >
                        {t('faq.contactSupport', 'Contact Support')}
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}

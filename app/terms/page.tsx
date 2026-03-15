'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

const sections = [
    {
        id: 'terms',
        title: '1. Terms of Use',
        content: `By accessing and using the Krafted Furniture website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.

We reserve the right to modify these terms at any time without prior notice. Your continued use of the website following any changes constitutes acceptance of the modified terms.

You must be at least 18 years of age to make purchases on our website. By placing an order, you confirm that you are of legal age and have the legal capacity to enter into a binding contract.`
    },
    {
        id: 'orders',
        title: '2. Orders & Pricing',
        content: `All prices displayed on our website are in Indian Rupees (INR) and include applicable taxes unless otherwise stated. Prices are subject to change without notice.

Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. An order is confirmed only when you receive an order confirmation email from us.

In case of pricing errors, we reserve the right to cancel orders placed at incorrect prices. We will notify you and offer a full refund in such cases.

Custom orders require a 50% advance payment. The remaining balance is due before delivery. Custom orders cannot be cancelled once production has begun.`
    },
    {
        id: 'payment',
        title: '3. Payment Terms',
        content: `We accept payments via credit cards, debit cards, UPI, net banking, and select digital wallets through our secure payment gateway partners.

All transactions are encrypted and processed securely. We do not store your complete payment information on our servers.

For EMI options, terms and interest rates are determined by your bank. We offer no-cost EMI on select products and tenures.

In case of payment failure, please try again or contact your bank. Failed transaction amounts are typically reversed within 5-7 working days.`
    },
    {
        id: 'shipping',
        title: '4. Shipping & Delivery',
        content: `We deliver across India and to select international destinations. Delivery times vary based on your location and product availability.

Standard delivery for in-stock items is 3-10 business days depending on your location. Custom-made furniture may take 4-6 weeks.

Shipping charges are calculated at checkout based on your delivery address and order value. Free shipping is available for orders above the specified threshold.

Please ensure someone is available to receive the delivery. Failed delivery attempts may result in additional charges.`
    },
    {
        id: 'returns',
        title: '5. Returns & Refunds',
        content: `We offer a 14-day return policy for unused products in their original packaging and condition. To initiate a return, contact our customer support within 14 days of delivery.

The following items are non-returnable:
• Custom-made or personalized furniture
• Sale or clearance items
• Items showing signs of use or damage
• Items without original packaging

Upon receiving and inspecting the returned item, refunds are processed within 7-10 business days to your original payment method. Original shipping charges are non-refundable unless the return is due to a defect or our error.`
    },
    {
        id: 'warranty',
        title: '6. Warranty',
        content: `All Krafted furniture comes with a 10-year structural warranty covering manufacturing defects under normal residential use.

Upholstery, fabrics, and finishes are covered for 2 years from the date of purchase.

Warranty does not cover:
• Damage from misuse, neglect, or accidents
• Normal wear and tear
• Commercial use of residential furniture
• Modifications or repairs by unauthorized parties
• Environmental damage (sun fading, humidity)

To claim warranty service, contact us with your order details and photos of the issue.`
    },
    {
        id: 'intellectual-property',
        title: '7. Intellectual Property',
        content: `All content on this website, including designs, images, logos, text, and graphics, is the property of Krafted Furniture and is protected by intellectual property laws.

You may not reproduce, distribute, or use any content from our website without prior written permission.

Our furniture designs are original creations. Any unauthorized reproduction or imitation is strictly prohibited and may result in legal action.`
    },
    {
        id: 'liability',
        title: '8. Limitation of Liability',
        content: `Krafted Furniture shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.

Our total liability for any claim shall not exceed the amount paid for the specific product or service in question.

We are not responsible for delays or failures caused by circumstances beyond our control, including natural disasters, strikes, or transportation disruptions.`
    },
    {
        id: 'privacy',
        title: '9. Privacy Policy',
        content: `We collect and process personal information in accordance with applicable data protection laws. Information collected includes name, contact details, payment information, and delivery address.

Your data is used to:
• Process and deliver orders
• Send order updates and notifications
• Improve our products and services
• Send marketing communications (with your consent)

We do not sell your personal information to third parties. Data is shared only with necessary service providers (payment processors, delivery partners) for order fulfillment.

You may request access to, correction of, or deletion of your personal data by contacting us.`
    },
    {
        id: 'governing-law',
        title: '10. Governing Law',
        content: `These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.

If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`
    }
]

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white pt-28 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Sparkles className="text-amber-600 w-5 h-5" />
                        <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-medium">Legal</span>
                        <Sparkles className="text-amber-600 w-5 h-5" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Last updated: January 2026
                    </p>
                </motion.div>

                {/* Table of Contents */}
                <motion.div
                    className="max-w-4xl mx-auto mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Table of Contents</h2>
                        <div className="grid md:grid-cols-2 gap-2">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="text-gray-600 hover:text-amber-600 transition-colors text-sm"
                                >
                                    {section.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Content Sections */}
                <div className="max-w-4xl mx-auto">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            id={section.id}
                            className="mb-10 scroll-mt-40"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                {section.title}
                            </h2>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {section.content}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact */}
                <motion.div
                    className="max-w-4xl mx-auto mt-16 bg-gray-50 rounded-2xl p-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h3 className="font-bold text-gray-900 mb-2">Questions about these terms?</h3>
                    <p className="text-gray-600 mb-4">Contact our legal team for clarification.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="mailto:legal@krafted.com" className="text-amber-600 hover:text-amber-700 font-medium">
                            legal@krafted.com
                        </a>
                        <span className="text-gray-300">|</span>
                        <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
                            Contact Form
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

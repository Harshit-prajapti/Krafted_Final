"use client"

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation('common');

    // Theme: Black (bg-gray-900), White (text-white), Yellow (text-amber-500)
    const bgColor = 'bg-black';
    const textColor = 'text-gray-400';
    const headingColor = 'text-white';
    const accentColor = 'text-amber-500';
    const hoverColor = 'hover:text-amber-500';

    return (
        <footer className={`${bgColor} border-t-4 border-amber-500 pt-10 pb-6`}>
            <div className="container mx-auto px-4 md:px-6">

                {/* Top Section: Links and Brand - Compact Layout */}
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">

                    {/* Brand & Socials */}
                    <div className="space-y-4 max-w-sm">
                        <h2 className={`text-2xl font-bold tracking-wider ${headingColor}`}>KRAFTED</h2>
                        <p className={`text-sm ${textColor}`}>
                            {t('footer.tagline')}
                        </p>
                        <div className="flex space-x-4 pt-2 border-b-3 border-b-gray-600">
                            <Link href="#" className={`${textColor} ${hoverColor} transition-colors`} aria-label="Instagram"><Instagram size={20} /></Link>
                            <Link href="#" className={`${textColor} ${hoverColor} transition-colors`} aria-label="Facebook"><Facebook size={20} /></Link>
                            <Link href="#" className={`${textColor} ${hoverColor} transition-colors`} aria-label="Twitter"><Twitter size={20} /></Link>
                            <br /> <br />
                        </div>
                    </div>

                    {/* Quick Links Group */}
                    <div className="flex space-x-12 md:space-x-16 border-b-3 border-b-gray-600">
                        <div>
                            <h3 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${headingColor}`}>{t('footer.explore')}</h3>
                            <ul className={`space-y-2 text-sm ${textColor}`}>
                                <li><Link href="/shop" className={`${hoverColor} transition-colors`}>{t('footer.products')}</Link></li>
                                <li><Link href="/categories/living-room" className={`${hoverColor} transition-colors`}>{t('footer.living')}</Link></li>
                                <li><Link href="/categories/bedroom" className={`${hoverColor} transition-colors`}>{t('footer.bedroom')}</Link></li>
                                <li><Link href="/sale" className={`${accentColor} hover:text-amber-400 transition-colors font-semibold`}>{t('labels.sale')}</Link></li>
                                <br /><br />
                            </ul>
                        </div>

                        <div>
                            <h3 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${headingColor}`}>{t('footer.support')}</h3>
                            <ul className={`space-y-2 text-sm ${textColor}`}>
                                <li><Link href="/contact" className={`${hoverColor} transition-colors`}>{t('nav.contact')}</Link></li>
                                <li><Link href="/faq" className={`${hoverColor} transition-colors`}>{t('footer.faqs')}</Link></li>
                                <li><Link href="/shipping" className={`${hoverColor} transition-colors`}>{t('footer.shippingLink')}</Link></li>
                                <li><Link href="/terms" className={`${hoverColor} transition-colors`}>{t('footer.terms')}</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info (Simplified) */}
                    <div className="space-y-3">
                        <h3 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${headingColor}`}>{t('footer.reachUs')}</h3>
                        <p className={`flex items-center text-sm ${textColor}`}>
                            <Phone size={16} className={`mr-3 ${accentColor}`} />
                            +91 12345 67890
                        </p>
                        <p className={`flex items-center text-sm ${textColor}`}>
                            <Mail size={16} className={`mr-3 ${accentColor}`} />
                            contact@krafted.com
                        </p>
                    </div>

                </div>

                {/* Bottom Bar: Copyright and Badges */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>{t('footer.securePayments')}</span>
                        <span>{t('footer.certifiedQuality')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

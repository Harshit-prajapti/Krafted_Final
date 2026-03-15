import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translations directly (bundled approach - works in Next.js SSR)
import enCommon from '@/public/locales/en/common.json';
import enHome from '@/public/locales/en/home.json';
import enShop from '@/public/locales/en/shop.json';
import enProduct from '@/public/locales/en/product.json';
import enCart from '@/public/locales/en/cart.json';
import enCheckout from '@/public/locales/en/checkout.json';
import enAuth from '@/public/locales/en/auth.json';
import enProfile from '@/public/locales/en/profile.json';
import enErrors from '@/public/locales/en/errors.json';
import enAbout from '@/public/locales/en/about.json';
import enContact from '@/public/locales/en/contact.json';
import enSupport from '@/public/locales/en/support.json';

import esCommon from '@/public/locales/es/common.json';
import esHome from '@/public/locales/es/home.json';
import esShop from '@/public/locales/es/shop.json';
import esProduct from '@/public/locales/es/product.json';
import esCart from '@/public/locales/es/cart.json';
import esCheckout from '@/public/locales/es/checkout.json';
import esAuth from '@/public/locales/es/auth.json';
import esProfile from '@/public/locales/es/profile.json';
import esErrors from '@/public/locales/es/errors.json';
import esAbout from '@/public/locales/es/about.json';
import esContact from '@/public/locales/es/contact.json';
import esSupport from '@/public/locales/es/support.json';

import frCommon from '@/public/locales/fr/common.json';
import frHome from '@/public/locales/fr/home.json';
import frShop from '@/public/locales/fr/shop.json';
import frProduct from '@/public/locales/fr/product.json';
import frCart from '@/public/locales/fr/cart.json';
import frCheckout from '@/public/locales/fr/checkout.json';
import frAuth from '@/public/locales/fr/auth.json';
import frProfile from '@/public/locales/fr/profile.json';
import frErrors from '@/public/locales/fr/errors.json';
import frAbout from '@/public/locales/fr/about.json';
import frContact from '@/public/locales/fr/contact.json';
import frSupport from '@/public/locales/fr/support.json';

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Bundled resources
const resources = {
    en: {
        common: enCommon,
        home: enHome,
        shop: enShop,
        product: enProduct,
        cart: enCart,
        checkout: enCheckout,
        auth: enAuth,
        profile: enProfile,
        errors: enErrors,
        about: enAbout,
        contact: enContact,
        support: enSupport,
    },
    es: {
        common: esCommon,
        home: esHome,
        shop: esShop,
        product: esProduct,
        cart: esCart,
        checkout: esCheckout,
        auth: esAuth,
        profile: esProfile,
        errors: esErrors,
        about: esAbout,
        contact: esContact,
        support: esSupport,
    },
    fr: {
        common: frCommon,
        home: frHome,
        shop: frShop,
        product: frProduct,
        cart: frCart,
        checkout: frCheckout,
        auth: frAuth,
        profile: frProfile,
        errors: frErrors,
        about: frAbout,
        contact: frContact,
        support: frSupport,
    },
};

// Get initial language from localStorage (client-side only)
const getInitialLanguage = (): SupportedLanguage => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('i18nextLng');
        if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
            return stored as SupportedLanguage;
        }
    }
    return 'en';
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLanguage(),
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGUAGES,

        ns: ['common', 'home', 'shop', 'product', 'cart', 'checkout', 'auth', 'profile', 'errors', 'about', 'contact', 'support'],
        defaultNS: 'common',

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },

        debug: process.env.NODE_ENV === 'development',
    });

export default i18n;

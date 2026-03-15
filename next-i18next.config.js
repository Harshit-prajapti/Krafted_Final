const path = require('path');

module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'fr', 'es'],
        localeDetection: true,
    },
    localePath: path.resolve('./public/locales'),
    reloadOnPrerender: process.env.NODE_ENV === 'development',

    // Performance optimization: namespace separation
    ns: [
        'common',
        'errors',
        'forms',
        'home',
        'shop',
        'product',
        'cart',
        'checkout',
        'auth',
        'profile',
        'admin',
        'categories',
        'search',
        'orders',
        'wishlist',
    ],
    defaultNS: 'common',

    // Enable interpolation
    interpolation: {
        escapeValue: false,
    },

    // React specific
    react: {
        useSuspense: false,
    },

    // Serialization for Next.js
    serializeConfig: false,
};

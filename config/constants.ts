// Image Priority
export const IMAGE_PRIORITY = {
    MIN: 1,
    MAX: 10,
    DEFAULT: 5,
} as const

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
} as const

// Currency
export const CURRENCY = {
    DEFAULT: 'INR',
    SYMBOL: '₹',
} as const

// Category Types
export const CATEGORY_TYPES = {
    PRODUCT_TYPE: 'PRODUCT_TYPE',
    ROOM: 'ROOM',
    STYLE: 'STYLE',
    CAMPAIGN: 'CAMPAIGN',
} as const

// Order Status
export const ORDER_STATUS = {
    CREATED: 'CREATED',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
} as const

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
} as const

// Payment Providers
export const PAYMENT_PROVIDERS = {
    RAZORPAY: 'RAZORPAY',
    STRIPE: 'STRIPE',
    OTHER: 'OTHER',
} as const

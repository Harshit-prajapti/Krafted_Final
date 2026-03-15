import { Payment, PaymentProvider, PaymentStatusEnum } from '@prisma/client'

// Payment creation DTO
export interface CreatePaymentDTO {
    orderId: string
    provider: PaymentProvider
    amount: number
    currency?: string
}

// Payment update DTO
export interface UpdatePaymentDTO {
    paymentIntentId?: string
    transactionId?: string
    status?: PaymentStatusEnum
    rawResponse?: any
}

// Payment intent response (for frontend)
export interface PaymentIntentResponse {
    paymentId: string
    provider: PaymentProvider
    amount: number
    currency: string
    clientSecret?: string // For Stripe
    orderId?: string // For Razorpay
    keyId?: string // For Razorpay
}

// Webhook payload types
export interface RazorpayWebhookPayload {
    event: string
    payload: {
        payment: {
            entity: {
                id: string
                order_id: string
                amount: number
                status: string
            }
        }
    }
}

export interface StripeWebhookPayload {
    type: string
    data: {
        object: {
            id: string
            amount: number
            status: string
            metadata: {
                orderId: string
            }
        }
    }
}

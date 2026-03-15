import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy initialization to prevent build failures when credentials are not set
let razorpayInstance: Razorpay | null = null

function getRazorpayInstance(): Razorpay {
    if (!razorpayInstance) {
        const keyId = process.env.RAZORPAY_KEY_ID
        const keySecret = process.env.RAZORPAY_KEY_SECRET

        if (!keyId || !keySecret) {
            throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
        }

        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        })
    }
    return razorpayInstance
}

export const razorpay = { get instance() { return getRazorpayInstance() } }

export interface RazorpayOrderOptions {
    amount: number
    currency?: string
    receipt: string
    notes?: Record<string, string>
}

export async function createRazorpayOrder(options: RazorpayOrderOptions) {
    const order = await getRazorpayInstance().orders.create({
        amount: Math.round(options.amount * 100),
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: options.notes || {},
    })
    return order
}

export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
        throw new Error('Razorpay key secret not configured')
    }

    const body = orderId + '|' + paymentId
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')

    return expectedSignature === signature
}

export function verifyWebhookSignature(
    body: string,
    signature: string
): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) {
        throw new Error('Razorpay webhook secret not configured')
    }

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')

    return expectedSignature === signature
}

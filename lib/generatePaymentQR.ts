'use client'

import * as QRCode from 'qrcode'

export interface OrderQROptions {
    orderId: string
    baseUrl?: string
}

export async function generateOrderQR(options: OrderQROptions): Promise<string> {
    const {
        orderId,
        baseUrl = 'https://kraftedfurniture.com'
    } = options

    const orderTrackingUrl = `${baseUrl}/admin/orders/track/${orderId}`

    try {
        const qrDataUrl = await QRCode.toDataURL(orderTrackingUrl, {
            width: 150,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        })
        return qrDataUrl
    } catch (error) {
        console.error('[GENERATE_QR_ERROR]', error)
        throw new Error('Failed to generate QR code')
    }
}

export async function generateOrderIdQR(orderId: string): Promise<string> {
    try {
        const qrDataUrl = await QRCode.toDataURL(`ORDER:${orderId}`, {
            width: 150,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        })
        return qrDataUrl
    } catch (error) {
        console.error('[GENERATE_QR_ERROR]', error)
        throw new Error('Failed to generate QR code')
    }
}

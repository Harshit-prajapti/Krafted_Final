'use client'

import { jsPDF } from 'jspdf'
import { generateOrderIdQR } from './generatePaymentQR'

export interface OrderSlipData {
    orderId: string
    createdAt: string
    trackingNumber?: string | null
    customer: {
        name: string
        email: string
        phone: string
    }
    shippingAddress: {
        firstName: string
        lastName: string
        addressLine1: string
        addressLine2?: string | null
        city: string
        state: string
        postalCode: string
        country: string
        phone: string
    }
    items: Array<{
        productName: string
        quantity: number
        price: number
        sku?: string | null
        colorName?: string | null
        size?: string | null
        material?: string | null
    }>
    payment: {
        paymentId?: string | null
        status: string
        amount: number
        method: string
    }
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

async function drawInvoice(doc: jsPDF, data: OrderSlipData, startY: number = 0): Promise<void> {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 10
    const contentWidth = pageWidth - 2 * margin
    let y = startY + margin

    doc.setFillColor(255, 193, 7)
    doc.rect(0, 0, pageWidth, 8, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Tax Invoice / Delivery Slip', margin, y + 12)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)

    const headerRightX = pageWidth - margin
    doc.text(`Order ID: ${data.orderId.slice(-12).toUpperCase()}`, headerRightX, y + 6, { align: 'right' })
    doc.text(`Invoice Date: ${formatDate(data.createdAt)}`, headerRightX, y + 12, { align: 'right' })
    if (data.payment.paymentId) {
        doc.text(`Payment ID: ${data.payment.paymentId}`, headerRightX, y + 18, { align: 'right' })
    }

    y += 28
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageWidth - margin, y)
    y += 8

    const colWidth = (contentWidth - 10) / 3

    doc.setFillColor(250, 250, 250)
    doc.rect(margin, y - 4, colWidth, 45, 'F')
    doc.rect(margin + colWidth + 5, y - 4, colWidth, 45, 'F')
    doc.rect(margin + (colWidth + 5) * 2, y - 4, colWidth, 45, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(40, 40, 40)
    doc.text('Sold By', margin + 3, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(60, 60, 60)
    doc.text('KRAFTED FURNITURE PVT. LTD.', margin + 3, y + 10)
    doc.text('123 Industrial Area, Sector 5', margin + 3, y + 16)
    doc.text('Mumbai, Maharashtra - 400001', margin + 3, y + 22)
    doc.text('GSTIN: 27AABCK1234A1Z5', margin + 3, y + 28)
    doc.text('Contact: 1800-XXX-XXXX', margin + 3, y + 34)

    const shipX = margin + colWidth + 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(40, 40, 40)
    doc.text('Shipping Address', shipX, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(60, 60, 60)
    const shipName = `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`
    doc.text(shipName, shipX, y + 10)
    doc.text(data.shippingAddress.addressLine1, shipX, y + 16)
    if (data.shippingAddress.addressLine2) {
        doc.text(data.shippingAddress.addressLine2, shipX, y + 22)
        doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.state}`, shipX, y + 28)
        doc.text(`${data.shippingAddress.postalCode}, ${data.shippingAddress.country}`, shipX, y + 34)
    } else {
        doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.state}`, shipX, y + 22)
        doc.text(`${data.shippingAddress.postalCode}, ${data.shippingAddress.country}`, shipX, y + 28)
        doc.text(`Phone: ${data.shippingAddress.phone}`, shipX, y + 34)
    }

    const billX = margin + (colWidth + 5) * 2 + 3
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(40, 40, 40)
    doc.text('Billing Address', billX, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(60, 60, 60)
    doc.text(shipName, billX, y + 10)
    doc.text(data.shippingAddress.addressLine1, billX, y + 16)
    if (data.shippingAddress.addressLine2) {
        doc.text(data.shippingAddress.addressLine2, billX, y + 22)
        doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.state}`, billX, y + 28)
        doc.text(`${data.shippingAddress.postalCode}`, billX, y + 34)
    } else {
        doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.state}`, billX, y + 22)
        doc.text(`${data.shippingAddress.postalCode}`, billX, y + 28)
        doc.text(`Email: ${data.customer.email}`, billX, y + 34)
    }

    y += 50

    doc.setFillColor(41, 128, 185)
    doc.rect(margin, y, contentWidth, 8, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(255, 255, 255)

    const tableHeaders = ['S.No', 'Product Description', 'SKU/Code', 'Qty', 'Unit Price', 'Total']
    const colWidths = [12, 75, 30, 15, 25, 28]
    let xPos = margin + 2

    tableHeaders.forEach((header, i) => {
        doc.text(header, xPos, y + 5.5)
        xPos += colWidths[i]
    })

    y += 10
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(40, 40, 40)

    let subtotal = 0

    data.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal

        if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250)
            doc.rect(margin, y - 3, contentWidth, 12, 'F')
        }

        xPos = margin + 2

        doc.text(String(index + 1), xPos + 3, y + 3)
        xPos += colWidths[0]

        let productDesc = item.productName
        if (item.colorName) productDesc += ` | Color: ${item.colorName}`
        if (item.size) productDesc += ` | Size: ${item.size}`
        if (item.material) productDesc += ` | ${item.material}`

        const descLines = doc.splitTextToSize(productDesc, colWidths[1] - 3)
        doc.text(descLines, xPos, y + 3)
        xPos += colWidths[1]

        doc.text(item.sku || 'N/A', xPos, y + 3)
        xPos += colWidths[2]

        doc.text(String(item.quantity), xPos + 3, y + 3)
        xPos += colWidths[3]

        doc.text(formatCurrency(item.price), xPos, y + 3)
        xPos += colWidths[4]

        doc.setFont('helvetica', 'bold')
        doc.text(formatCurrency(itemTotal), xPos, y + 3)
        doc.setFont('helvetica', 'normal')

        y += Math.max(descLines.length * 4, 12)
    })

    y += 5
    doc.line(margin, y, pageWidth - margin, y)
    y += 8

    const summaryX = pageWidth - margin - 70

    doc.setFillColor(245, 245, 245)
    doc.rect(summaryX - 5, y - 4, 75, 30, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('Subtotal:', summaryX, y + 2)
    doc.text(formatCurrency(subtotal), summaryX + 55, y + 2, { align: 'right' })

    doc.text('Shipping:', summaryX, y + 10)
    doc.text('FREE', summaryX + 55, y + 10, { align: 'right' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('TOTAL:', summaryX, y + 20)
    doc.setTextColor(34, 139, 34)
    doc.text(formatCurrency(data.payment.amount), summaryX + 55, y + 20, { align: 'right' })

    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text(`Total Qty: ${data.items.reduce((sum, item) => sum + item.quantity, 0)}`, margin, y + 2)

    y += 35

    doc.setFillColor(255, 248, 220)
    doc.roundedRect(margin, y - 3, contentWidth / 2 - 5, 40, 2, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(40, 40, 40)
    doc.text('Payment Information', margin + 5, y + 5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(60, 60, 60)

    const paymentStatusColor = data.payment.status === 'PAID' ? [34, 139, 34] : [220, 53, 69]
    doc.text('Payment Status:', margin + 5, y + 14)
    doc.setTextColor(paymentStatusColor[0], paymentStatusColor[1], paymentStatusColor[2])
    doc.setFont('helvetica', 'bold')
    doc.text(data.payment.status, margin + 40, y + 14)

    doc.setTextColor(60, 60, 60)
    doc.setFont('helvetica', 'normal')
    doc.text(`Payment Method: ${data.payment.method}`, margin + 5, y + 22)
    doc.text(`Amount: ${formatCurrency(data.payment.amount)}`, margin + 5, y + 30)

    const qrX = margin + contentWidth / 2 + 10
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(qrX, y - 3, contentWidth / 2 - 15, 40, 2, 2, 'F')
    doc.setDrawColor(200, 200, 200)
    doc.roundedRect(qrX, y - 3, contentWidth / 2 - 15, 40, 2, 2, 'S')

    try {
        const qrDataUrl = await generateOrderIdQR(data.orderId)

        doc.addImage(qrDataUrl, 'PNG', qrX + 5, y, 32, 32)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(40, 40, 40)
        doc.text('Scan for Order Info', qrX + 45, y + 10)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(6)
        doc.setTextColor(100, 100, 100)
        doc.text('Order Tracking QR Code', qrX + 45, y + 16)
        doc.text(`Order: #${data.orderId.slice(-8).toUpperCase()}`, qrX + 45, y + 22)
        doc.text('Scan to view order details', qrX + 45, y + 28)
    } catch (error) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.text('QR Code', qrX + 20, y + 18)
    }

    y += 50

    doc.line(margin, y, pageWidth - margin, y)
    y += 8

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(40, 40, 40)
    doc.text('Declaration:', margin, y)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(80, 80, 80)
    doc.text('The goods sold are intended for end user consumption and not for resale. All disputes are subject to Mumbai jurisdiction.', margin, y + 6)

    const sigX = pageWidth - margin - 50
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(40, 40, 40)
    doc.text('Authorized Signatory', sigX, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('KRAFTED FURNITURE', sigX, y + 10)

    doc.line(sigX - 5, y + 14, sigX + 45, y + 14)

    y = pageHeight - 15
    doc.setFillColor(41, 128, 185)
    doc.rect(0, y, pageWidth, 15, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(255, 255, 255)
    doc.text('Thank you for shopping with Krafted Furniture!', pageWidth / 2, y + 6, { align: 'center' })
    doc.text('For support: support@kraftedfurniture.com | 1800-XXX-XXXX | www.kraftedfurniture.com', pageWidth / 2, y + 11, { align: 'center' })
}

export async function generateSingleDeliverySlip(data: OrderSlipData): Promise<void> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    await drawInvoice(doc, data)

    doc.save(`invoice-${data.orderId.slice(-8).toUpperCase()}.pdf`)
}

export async function generateBulkDeliverySlips(orders: OrderSlipData[]): Promise<void> {
    if (orders.length === 0) return

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    for (let i = 0; i < orders.length; i++) {
        if (i > 0) {
            doc.addPage()
        }
        await drawInvoice(doc, orders[i])
    }

    const timestamp = new Date().toISOString().slice(0, 10)
    doc.save(`invoices-${timestamp}.pdf`)
}

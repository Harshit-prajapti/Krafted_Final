import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

/**
 * POST /api/auth/forgot-password
 * Generate password reset token and send email
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a password reset link.'
            })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

        // Store token in database
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: resetToken,
                expires: resetTokenExpiry
            }
        })

        // TODO: Send email with reset link
        // For now, we'll just log it (you'll need to implement email sending)
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
        console.log('Password Reset URL:', resetUrl)
        console.log('Send this link to:', email)

        // In production, you would send an email here using a service like:
        // - SendGrid
        // - AWS SES
        // - Resend
        // - Nodemailer

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive a password reset link.',
            // Remove this in production - only for development
            resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        })

    } catch (error) {
        console.error('[FORGOT_PASSWORD_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

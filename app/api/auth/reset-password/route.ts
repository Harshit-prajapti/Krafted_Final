import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * POST /api/auth/reset-password
 * Reset user password using valid token
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, password } = body

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Find and validate token
        const resetToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 400 }
            )
        }

        // Check if token is expired
        if (resetToken.expires < new Date()) {
            // Delete expired token
            await prisma.verificationToken.delete({
                where: { token }
            })

            return NextResponse.json(
                { error: 'Token has expired' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user password
        await prisma.user.update({
            where: { email: resetToken.identifier },
            data: { password: hashedPassword }
        })

        // Delete used token
        await prisma.verificationToken.delete({
            where: { token }
        })

        return NextResponse.json({
            message: 'Password has been reset successfully'
        })

    } catch (error) {
        console.error('[RESET_PASSWORD_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

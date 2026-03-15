import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/auth/validate-reset-token
 * Validate if a password reset token is valid and not expired
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token } = body

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            )
        }

        // Find token in database
        const resetToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid token' },
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

        return NextResponse.json({ valid: true })

    } catch (error) {
        console.error('[VALIDATE_TOKEN_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

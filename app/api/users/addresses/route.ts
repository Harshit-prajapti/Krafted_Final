import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const addressSchema = z.object({
    type: z.enum(['SHIPPING', 'BILLING', 'BOTH']).default('BOTH'),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(10),
    addressLine1: z.string().min(5),
    addressLine2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(5),
    zipCode: z.string().optional(),
    country: z.string().default('India'),
    isDefault: z.boolean().default(false)
})

/**
 * GET /api/users/addresses
 * Get user's addresses
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return NextResponse.json({
            data: addresses,
            total: addresses.length
        })

    } catch (error) {
        console.error('[ADDRESSES_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/users/addresses
 * Create new address
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validation = addressSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const data = validation.data

        // If this is set as default, unset other defaults
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true
                },
                data: { isDefault: false }
            })
        }

        // Create full name from first and last
        const fullName = `${data.firstName} ${data.lastName}`

        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                type: data.type,
                firstName: data.firstName,
                lastName: data.lastName,
                fullName,
                phone: data.phone,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                zipCode: data.zipCode,
                country: data.country,
                isDefault: data.isDefault
            }
        })

        return NextResponse.json(address, { status: 201 })

    } catch (error) {
        console.error('[ADDRESSES_POST_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

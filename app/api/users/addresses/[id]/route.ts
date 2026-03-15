import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const updateAddressSchema = z.object({
    type: z.enum(['SHIPPING', 'BILLING', 'BOTH']).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    addressLine1: z.string().min(5).optional(),
    addressLine2: z.string().optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    postalCode: z.string().min(5).optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    isDefault: z.boolean().optional()
})

/**
 * PUT /api/users/addresses/[id]
 * Update address
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validation = updateAddressSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const data = validation.data

        // Verify address belongs to user
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!existingAddress) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            )
        }

        // If setting as default, unset other defaults
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true,
                    id: { not: id }
                },
                data: { isDefault: false }
            })
        }

        // Update full name if first or last name changed
        let fullName = existingAddress.fullName
        if (data.firstName || data.lastName) {
            const firstName = data.firstName || existingAddress.firstName
            const lastName = data.lastName || existingAddress.lastName
            fullName = `${firstName} ${lastName}`
        }

        const address = await prisma.address.update({
            where: { id: id },
            data: {
                ...data,
                fullName
            }
        })

        return NextResponse.json(address)

    } catch (error) {
        console.error('[ADDRESS_PUT_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/users/addresses/[id]
 * Delete address
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify address belongs to user and delete
        const result = await prisma.address.deleteMany({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (result.count === 0) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Address deleted successfully'
        })

    } catch (error) {
        console.error('[ADDRESS_DELETE_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

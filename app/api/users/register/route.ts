import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, password } = body
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
        })

        if (existingUser) {
            if (!existingUser.password) {
                const hashedPassword = await bcrypt.hash(password, 10)

                const user = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        password: hashedPassword,
                        name: existingUser.name || name,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                })

                return NextResponse.json(user, { status: 200 })
            }

            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Default role
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error('Error registering user:', error)
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        )
    }
}

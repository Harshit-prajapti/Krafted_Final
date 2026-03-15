import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// GET: List all colors
export async function GET() {
    try {
        const colors = await prisma.color.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        })
        return NextResponse.json(colors)
    } catch (error) {
        console.error('Error fetching colors:', error)
        return NextResponse.json(
            { error: 'Failed to fetch colors' },
            { status: 500 }
        )
    }
}

// POST: Create a new color
export async function POST(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions)

        // if (!session || session.user.role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { name, hexCode } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const color = await prisma.color.create({
            data: {
                name,
                hexCode,
                isActive: true,
            },
        })

        return NextResponse.json(color, { status: 201 })
    } catch (error) {
        console.error('Error creating color:', error)
        return NextResponse.json(
            { error: 'Failed to create color' },
            { status: 500 }
        )
    }
}

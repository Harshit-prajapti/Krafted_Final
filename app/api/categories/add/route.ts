import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Zod Schema for Category Creation
const categorySchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    type: z.enum(['PRODUCT_TYPE', 'ROOM', 'STYLE', 'CAMPAIGN']),
    isActive: z.boolean().default(true),
    parentIds: z.array(z.string()).optional().default([]),
    childrenIds: z.array(z.string()).optional().default([])
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
        }

        const body = await request.json()
        const validation = categorySchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const data = validation.data

        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                type: data.type,
                isActive: data.isActive,
                // Relations for parents (Categories that are parents to this one)
                // We are the child, so we create the relation and connect the parent.
                parents: data.parentIds.length > 0 ? {
                    create: data.parentIds.map((id) => ({
                        parent: {
                            connect: { id: id }
                        }
                    })),
                } : undefined,
                // Relations for children (Categories that are children to this one)
                // We are the parent, so we create the relation and connect the child.
                children: data.childrenIds.length > 0 ? {
                    create: data.childrenIds.map((id) => ({
                        child: {
                            connect: { id: id }
                        }
                    })),
                } : undefined,
            },
        })
        return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating category:', error)

        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 409 })
        }

        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        )
    }
}

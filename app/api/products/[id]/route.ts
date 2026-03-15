import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Validation schema for update (all optional)
const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    material: z.string().optional(),
    dimensions: z.string().optional(),
    isActive: z.boolean().optional(),
    categoryIds: z.array(z.string()).optional(),
    colorIds: z.array(z.string()).optional(),
    // For images, we might want to Add/Remove, but simple replacement is easier for now, 
    // or we accept a full list to sync. Let's assume full sync for simplicity in this iteration.
    images: z.array(z.object({
        imageUrl: z.string().url(),
        altText: z.string().optional(),
        isPrimary: z.boolean().default(false),
        priority: z.number().default(5)
    })).optional(),
    stock: z.number().int().nonnegative().optional(),
})

// GET: Get single product details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                categories: { include: { category: true } },
                // colors: { include: { color: true } },
                images: { orderBy: { priority: 'asc' } },
                // inventory: true
            }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

// PUT: Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const json = await request.json()
        const body = updateProductSchema.parse(json)

        // Prepare update data
        const updateData: any = {
            name: body.name,
            slug: body.slug,
            description: body.description,
            price: body.price,
            material: body.material,
            dimensions: body.dimensions,
            isActive: body.isActive,
        }

        // Handle Categories (Re-sync)
        if (body.categoryIds) {
            // Delete existing relations and create new ones is one way, 
            // but deleteMany followed by create is wrapped in transaction by prisma update? No.
            // Better to use set/connect/disconnect if possible, or deleteMany separate.
            // Prisma update allows 'deleteMany' inside relations? No, it allows 'deleteMany' for some.
            // For many-to-many with explicit table (ProductCategory), we can use deleteMany.
            updateData.categories = {
                deleteMany: {}, // Delete all existing
                create: body.categoryIds.map(id => ({
                    category: { connect: { id } }
                }))
            }
        }

        // Handle Colors (Re-sync)
        // if (body.colorIds) {
        //     updateData.colors = {
        //         deleteMany: {},
        //         create: body.colorIds.map(id => ({
        //             color: { connect: { id } }
        //         }))
        //     }
        // }

        // Handle Images (Re-sync strategy: delete all and add new? Or smart diff? 
        // For simplicity, delete all and recreate is safest for order/priority consistency)
        if (body.images) {
            updateData.images = {
                deleteMany: {},
                create: body.images.map(img => ({
                    imageUrl: img.imageUrl,
                    altText: img.altText,
                    isPrimary: img.isPrimary,
                    priority: img.priority
                }))
            }
        }

        // Handle Inventory (Update quantity)
        // if (body.stock !== undefined) {
        //     updateData.inventory = {
        //         upsert: {
        //             create: { quantity: body.stock },
        //             update: { quantity: body.stock }
        //         }
        //     }
        // }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                categories: true,
                // colors: true,
                images: true,
                // inventory: true
            }
        })

        return NextResponse.json({ message: 'Product updated successfully', product })
    } catch (error) {
        console.error('Error updating product:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
        }
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

// DELETE: Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}

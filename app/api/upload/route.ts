import { authOptions } from "@/lib/auth"
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        // Check if Cloudinary is configured
        if (!isCloudinaryConfigured) {
            return NextResponse.json(
                { error: 'Image upload is not configured. Please set up Cloudinary credentials.' },
                { status: 503 }
            )
        }

        const session = await getServerSession(authOptions)

        // Ensure user is authorized (Admin)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Convert to base64 data URI for Cloudinary upload
        const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`

        const imageUrl = await uploadImage(fileBase64, 'krafted-furniture/products')

        return NextResponse.json({ url: imageUrl }, { status: 201 })
    } catch (error) {
        console.error('Error uploading image:', error)
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        )
    }
}

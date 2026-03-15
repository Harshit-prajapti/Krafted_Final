import { v2 as cloudinary } from 'cloudinary'
import { env } from './env'

// Check if Cloudinary is configured
export const isCloudinaryConfigured = !!(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
)

// Configure Cloudinary only if credentials are available
if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
    })
}

export { cloudinary }

/**
 * Upload image to Cloudinary
 * @param file - File path or base64 string
 * @param folder - Cloudinary folder (e.g., 'products', 'categories')
 * @returns Secure URL of uploaded image
 */
export async function uploadImage(
    file: string,
    folder: string = 'krafted-furniture'
): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: 'auto',
        })
        return result.secure_url
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw new Error('Failed to upload image to Cloudinary')
    }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image
 */
export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        throw new Error('Failed to delete image from Cloudinary')
    }
}

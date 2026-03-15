
import { ProductImage as PrismaProductImage } from '@prisma/client';

export type ProductImage = PrismaProductImage;

// Image Upload Response (Cloudinary)
export interface ImageUploadResponse {
    publicId: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
}

// Image DTO for Product Creation
export interface ProductImageInput {
    imageUrl: string;
    altText?: string;
    priority?: number;
    isPrimary?: boolean;
}

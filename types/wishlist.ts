// Type definitions for Wishlist system

import { WishlistItem as PrismaWishlistItem, Product, ProductImage } from '@prisma/client';

export type WishlistItem = PrismaWishlistItem;

// Wishlist item with product
export interface WishlistItemWithProduct extends WishlistItem {
    product: Product & {
        images: ProductImage[];
    };
}

// Wishlist creation DTO
export interface AddToWishlistDTO {
    productId: string;
}

// Wishlist list response
export interface WishlistResponse {
    items: WishlistItemWithProduct[];
    total: number;
}

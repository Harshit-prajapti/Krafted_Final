
import {
    Cart as PrismaCart,
    CartItem as PrismaCartItem,
    Product,
    ProductImage,
    ProductVariant,
    Color
} from '@prisma/client';

export type Cart = PrismaCart;
export type CartItem = PrismaCartItem;
import { UpdateProductDTO } from './product';
// Cart Item Data for Frontend
export interface CartItemData {
    id: string
    quantity: number
    product: {
        id: string
        name: string
        slug: string
        basePrice: number
        images: Array<{
            imageUrl: string
            altText: string | null
        }>
    }
    variant: {
        id: string
        size: string | null
        material: string | null
        price: number | null
        color: {
            name: string
            hexCode: string | null
        } | null
    } | null
}
// Cart Item with Product and Variant details
export type CartItemWithRelations = CartItem & {
    product: Product & {
        images: ProductImage[];
    };
    variant?: (ProductVariant & {
        color: Color | null;
    }) | null;
};

// Full Cart with Items
export type CartWithItems = Cart & {
    items: CartItemWithRelations[];
};

// Cart Response for Frontend
export interface CartResponse {
    id: string;
    userId: string;
    updatedAt: string;
    items: CartItemData[];
    subtotal: number;
    itemCount: number;
}

// Add to Cart DTO
export interface AddToCartDTO {
    productId: string;
    variantId?: string;
    quantity: number;
}

// Update Cart Item DTO
export interface UpdateCartItemDTO {
    quantity: number;
}

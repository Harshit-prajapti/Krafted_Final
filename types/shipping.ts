// Type definitions for Shipping system

import { Shipping as PrismaShipping, ShippingStatus, Order } from '@prisma/client';

export type Shipping = PrismaShipping;

export { ShippingStatus };

// Shipping with order
export interface ShippingWithOrder extends Shipping {
    order: Order;
}

// Shipping creation DTO
export interface CreateShippingDTO {
    orderId: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
}

// Shipping update DTO
export interface UpdateShippingDTO {
    trackingNumber?: string;
    carrier?: string;
    status?: ShippingStatus;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
}

// Shipping tracking response
export interface ShippingTrackingResponse {
    id: string;
    orderId: string;
    trackingNumber: string | null;
    carrier: string | null;
    status: ShippingStatus;
    estimatedDelivery: string | null;
    actualDelivery: string | null;
    createdAt: string;
    updatedAt: string;
}

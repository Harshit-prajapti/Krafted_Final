
import {
    Order as PrismaOrder,
    OrderItem as PrismaOrderItem,
    OrderStatus,
    PaymentStatus,
    OrderHistory,
    Payment,
    Address,
    Shipping,
    ProductVariant
} from '@prisma/client';

export { OrderStatus, PaymentStatus };

export type Order = PrismaOrder;
export type OrderItem = PrismaOrderItem;

// Order with all relations loaded
export type OrderWithRelations = Order & {
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
    payments: Payment[];
    shipping?: Shipping | null;
    history: OrderHistory[];
};

// Frontend Order Response
export interface OrderResponse {
    id: string;
    userId: string;
    totalAmount: string; // Decimal -> string
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;

    shippingAddress: Address; // Re-use Address type (or simplified version)
    billingAddress: Address;

    items: Array<{
        id: string;
        productId: string;
        productName: string;
        variantId: string | null;
        sku: string | null;
        colorName: string | null;
        size: string | null;
        material: string | null;
        price: string;
        quantity: number;
        image?: string; // Optional if we fetch it separately or hydration
    }>;

    shipping?: {
        trackingNumber: string | null;
        carrier: string | null;
        status: string;
        estimatedDelivery: string | null;
    } | null;
}

// Create Order DTO
export interface CreateOrderDTO {
    shippingAddressId: string; // Required by schema
    billingAddressId: string;  // Required by schema
    // Items are usually created from Cart on backend, but if manual:
    items?: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
    }>;
}

// Update Order DTO
export interface UpdateOrderDTO {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string; // For shipping update shortcut
    carrier?: string;
}

// Order History Input
export interface AddOrderHistoryDTO {
    orderId: string;
    status: OrderStatus;
    notes?: string;
}

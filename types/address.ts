// Type definitions for Address system (Updated)

import { Address as PrismaAddress, AddressType, User, Order } from '@prisma/client';

export type Address = PrismaAddress;

export { AddressType };

export interface AddressWithUser extends Address {
    user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface AddressWithOrders extends Address {
    shippingOrders: Order[];
    billingOrders: Order[];
}

export interface AddressInput {
    type?: AddressType;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    phone: string;
    isDefault?: boolean;
}

export interface AddressUpdateInput {
    type?: AddressType;
    firstName?: string;
    lastName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    isDefault?: boolean;
}

export interface AddressListResponse {
    addresses: Address[];
    total: number;
}

// Helper function to format address as string
export function formatAddress(address: Address): string {
    const parts = [
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.postalCode,
        address.country
    ].filter(Boolean);

    return parts.join(', ');
}

// Helper function to get full name
export function getFullName(address: Address): string {
    return `${address.firstName} ${address.lastName}`.trim();
}

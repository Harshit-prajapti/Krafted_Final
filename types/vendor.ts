
import { Vendor as PrismaVendor, VendorStatus, User, Product } from '@prisma/client';

export type Vendor = PrismaVendor;
export { VendorStatus };

// Vendor with User details
export type VendorWithUser = Vendor & {
    user: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
};

// Vendor Registration DTO
export interface RegisterVendorDTO {
    businessName: string;
    description?: string;
    logo?: string;
    banner?: string;
}

// Vendor Dashboard Stats
export interface VendorStats {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalRevenue: string; // Decimal -> string
    balance: string; // Decimal -> string
}

// Update Vendor System DTO (Admin)
export interface UpdateVendorStatusDTO {
    status: VendorStatus;
    commission?: number;
}

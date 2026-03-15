
import {
    Review as PrismaReview,
    VendorReview as PrismaVendorReview,
    User,
    Product,
    Vendor
} from '@prisma/client';

export type Review = PrismaReview;
export type VendorReview = PrismaVendorReview;

// Product Review with User
export type ReviewWithUser = Review & {
    user: Pick<User, 'id' | 'name'>;
};

// Vendor Review with User
export type VendorReviewWithUser = VendorReview & {
    user: Pick<User, 'id' | 'name'>;
};

// Create Product Review DTO
export interface CreateReviewDTO {
    productId: string;
    rating: number; // 1-5
    comment?: string;
}

// Create Vendor Review DTO
export interface CreateVendorReviewDTO {
    vendorId: string;
    rating: number; // 1-5
    comment?: string;
}

// Review Stats
export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number }; // 5: 10, 4: 5...
}

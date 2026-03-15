
import {
  Product as PrismaProduct,
  ProductImage,
  ProductCategory,
  Category,
  ProductVariant,
  Color,
  Vendor,
  Review,
  WishlistItem
} from '@prisma/client';

export type Product = PrismaProduct;

// Product with all common relations included
export type ProductWithRelations = Product & {
  images: ProductImage[];
  categories: (ProductCategory & { category: Category })[];
  variants: (ProductVariant & { color: Color | null })[];
  vendor?: Vendor | null;
  reviews?: Review[];
  // wishlistItems is usually not included in full list, but okay to have in specific queries
};

// Simplified Product Response for Frontend (JSON serializable)
export interface ProductResponse {
  id: string;
  vendorId: string | null;
  name: string;
  slug: string;
  description: string;
  basePrice: string; // Decimal serialized to string
  material: string | null;
  dimensions: string | null;
  weight: string | null; // Decimal serialized to string
  isActive: boolean;
  createdAt: string; // Date serialized
  updatedAt: string; // Date serialized

  vendor?: {
    id: string;
    businessName: string;
  } | null;

  categories: Array<{
    id: string;
    name: string;
    slug: string;
    type: string;
  }>;

  variants: Array<{
    id: string;
    sku: string;
    price: string | null; // Override price
    color: {
      id: string;
      name: string;
      hexCode: string | null;
    } | null;
    size: string | null;
    material: string | null;
    isActive: boolean;
  }>;

  images: Array<{
    id: string;
    imageUrl: string;
    altText: string | null;
    priority: number;
    isPrimary: boolean;
  }>;

  averageRating?: number;
  totalReviews?: number;
}

// Product Creation DTO
export interface CreateProductDTO {
  name: string;
  slug: string;
  description: string;
  basePrice: number; // Input as number
  material?: string;
  dimensions?: string;
  weight?: number;

  categoryIds: string[];
  colorIds: string[]; // For creating variants automatically based on color

  images?: Array<{
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean;
    priority?: number;
  }>;

  initialStock?: number; // Optional, though no direct inventory model anymore, might be for internal logic
}

// Product Update DTO
export interface UpdateProductDTO {
  name?: string;
  slug?: string;
  description?: string;
  basePrice?: number;
  material?: string;
  dimensions?: string;
  weight?: number;
  isActive?: boolean;

  categoryIds?: string[];
  colorIds?: string[];

  images?: Array<{
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean; // If updating, usually we replace whole list or handle diffs
    priority?: number;
  }>;
}

// Filter Options
export interface ProductFilter {
  categoryId?: string;
  colorId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

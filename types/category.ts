
import {
    Category as PrismaCategory,
    CategoryType,
    CategoryRelation,
    ProductCategory
} from '@prisma/client';

export type Category = PrismaCategory;
export { CategoryType };

// Category with hierarchy relations
export type CategoryWithRelations = Category & {
    parents: (CategoryRelation & { parent: Category })[];
    children: (CategoryRelation & { child: Category })[];
    products?: ProductCategory[];
};

// Tree Structure for Frontend Navigation
export interface CategoryTreeNode {
    id: string;
    name: string;
    slug: string;
    type: CategoryType;
    children: CategoryTreeNode[];
    productCount?: number;
}

// Create Category DTO


export interface CreateCategoryDTO {
    name: string;
    slug: string;
    type: CategoryType;
    parentIds?: string[]; // IDs of parent categories
    childrenIds?: string[]; // IDs of child categories
    isActive?: boolean;
}

// Update Category DTO
export interface UpdateCategoryDTO {
    id: string;
    name: string;
    slug: string;
    type: CategoryType;
    parentId: string;
    productsId: String[];
    parentsId: string[];
    childrensId: string[];
    isActive: boolean;
}

// Simple Response
export interface CategoryResponse {
    id: string;
    name: string;
    slug: string;
    type: string;
    isActive: boolean;
}

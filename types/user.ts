
import { User as PrismaUser, UserRole, Address } from '@prisma/client';

export type User = PrismaUser;
export { UserRole };

// Safe User (for Session/Frontend) - No Password
export type SafeUser = Omit<User, 'password'>;

// User with Profile Data
export type UserWithProfile = SafeUser & {
    addresses: Address[];
    // orders, reviews etc can be fetched separately
};

// Registration DTO
export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

// Login DTO
export interface LoginDTO {
    email: string;
    password: string;
}

// Update User DTO
export interface UpdateUserDTO {
    name?: string;
    phone?: string;
    // Email updates usually require verification flow
}

// Admin Update User DTO
export interface AdminUpdateUserDTO {
    role?: UserRole;
    name?: string;
    email?: string;
}

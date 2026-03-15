export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export function isAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN
}

export function isUser(role: UserRole): boolean {
    return role === UserRole.USER
}

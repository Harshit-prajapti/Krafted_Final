# API Documentation

## Overview

All API routes are created with placeholder implementations. This document describes the intended functionality for each endpoint.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via NextAuth session. Admin-only endpoints require `ADMIN` role.

### Session Structure

```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: "USER" | "ADMIN"
  }
}
```

---

## Authentication Endpoints

### POST /api/auth/[...nextauth]

NextAuth handler for authentication.

**Providers**: Credentials (email/password)

**Login Request**:
```json
{
  "email": "admin@krafted.com",
  "password": "admin123"
}
```

---

## User Endpoints

### POST /api/users/register

Register a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-12-18T00:00:00Z"
}
```

### GET /api/users/profile

Get current user's profile. **Authentication required**.

**Response**:
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-12-18T00:00:00Z",
  "updatedAt": "2025-12-18T00:00:00Z"
}
```

### PUT /api/users/profile

Update current user's profile. **Authentication required**.

**Request Body**:
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "password": "newpassword123"
}
```

All fields are optional. Only include fields you want to update.

**Response**: Updated user profile

### GET /api/users

List all users. **Admin only**.

**Query Parameters**:
- `role` (UserRole) - Filter by role (USER/ADMIN)
- `page` (number) - Page number (default: 1)
- `pageSize` (number) - Items per page (default: 20)

**Response**:
```typescript
{
  users: SafeUser[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

---

## Product Endpoints

### GET /api/products

List products with optional filters.

**Query Parameters**:
- `categoryId` (string) - Filter by category
- `colorId` (string) - Filter by color
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `search` (string) - Search in name/description
- `page` (number) - Page number (default: 1)
- `pageSize` (number) - Items per page (default: 20)

**Response**:
```typescript
{
  products: ProductWithRelations[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

**Example**:
```
GET /api/products?categoryId=abc123&minPrice=5000&page=1&pageSize=20
```

### POST /api/products

Create a new product. **Admin only**.

**Request Body**:
```json
{
  "name": "Modern Leather Sofa",
  "slug": "modern-leather-sofa",
  "description": "Luxurious 3-seater sofa...",
  "price": 45000,
  "material": "Genuine Leather",
  "dimensions": "220x90x85 cm",
  "categoryIds": ["cat1", "cat2"],
  "colorIds": ["color1", "color2"],
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "altText": "Front view",
      "priority": 1,
      "isPrimary": true
    }
  ],
  "inventory": {
    "quantity": 50
  }
}
```

**Response**: Created product with relations

---

## Category Endpoints

### GET /api/categories

List categories with optional filters.

**Query Parameters**:
- `type` (CategoryType) - Filter by type (PRODUCT_TYPE, ROOM, STYLE, CAMPAIGN)
- `parentId` (string) - Filter by parent category (null for root categories)
- `isActive` (boolean) - Filter active/inactive

**Response**:
```typescript
CategoryWithChildren[]
```

**Example**:
```
GET /api/categories?type=ROOM&isActive=true
```

### POST /api/categories

Create a new category. **Admin only**.

**Request Body**:
```json
{
  "name": "Living Room",
  "slug": "living-room",
  "type": "ROOM",
  "parentId": null
}
```

**Response**: Created category

---

## Order Endpoints

### GET /api/orders

List user's orders. **Authentication required**.

**Query Parameters**:
- `status` (OrderStatus) - Filter by order status
- `paymentStatus` (PaymentStatus) - Filter by payment status
- `page` (number) - Page number
- `pageSize` (number) - Items per page

**Response**:
```typescript
{
  orders: OrderWithRelations[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

### POST /api/orders

Create a new order. **Authentication required**.

**Request Body**:
```json
{
  "items": [
    {
      "productId": "prod123",
      "quantity": 2
    }
  ]
}
```

**Response**:
```json
{
  "orderId": "order123",
  "totalAmount": 90000,
  "status": "CREATED",
  "paymentStatus": "PENDING"
}
```

---

## Payment Endpoints

### POST /api/payments

Create a payment intent. **Authentication required**.

**Request Body**:
```json
{
  "orderId": "order123",
  "provider": "RAZORPAY",
  "amount": 90000,
  "currency": "INR"
}
```

**Response** (Razorpay):
```json
{
  "paymentId": "pay123",
  "provider": "RAZORPAY",
  "amount": 90000,
  "currency": "INR",
  "orderId": "razorpay_order_id",
  "keyId": "rzp_test_xxx"
}
```

**Response** (Stripe):
```json
{
  "paymentId": "pay123",
  "provider": "STRIPE",
  "amount": 90000,
  "currency": "INR",
  "clientSecret": "pi_xxx_secret_yyy"
}
```

### POST /api/payments/webhook/razorpay

Handle Razorpay webhook events.

**Headers**:
- `x-razorpay-signature` - Webhook signature for verification

**Payload**:
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxx",
        "order_id": "order_xxx",
        "amount": 9000000,
        "status": "captured"
      }
    }
  }
}
```

**Response**: 200 OK

### POST /api/payments/webhook/stripe

Handle Stripe webhook events.

**Headers**:
- `stripe-signature` - Webhook signature for verification

**Payload**:
```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_xxx",
      "amount": 9000000,
      "status": "succeeded",
      "metadata": {
        "orderId": "order123"
      }
    }
  }
}
```

**Response**: 200 OK

---

## Cart Endpoints

### GET /api/cart

Get user's cart. **Authentication required**.

**Response**:
```json
{
  "id": "cart123",
  "userId": "user123",
  "items": [
    {
      "id": "item1",
      "productId": "prod123",
      "quantity": 2,
      "product": {
        "name": "Modern Sofa",
        "price": 45000,
        "images": [...]
      }
    }
  ],
  "updatedAt": "2025-12-18T00:00:00Z"
}
```

### POST /api/cart

Add item to cart. **Authentication required**.

**Request Body**:
```json
{
  "productId": "prod123",
  "quantity": 2
}
```

**Response**: Updated cart

### PUT /api/cart

Update cart item quantity. **Authentication required**.

**Request Body**:
```json
{
  "cartItemId": "item1",
  "quantity": 3
}
```

**Response**: Updated cart

### DELETE /api/cart

Remove item from cart. **Authentication required**.

**Query Parameters**:
- `cartItemId` (string) - ID of cart item to remove

**Response**: Updated cart

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Types

### ProductWithRelations

```typescript
{
  id: string
  name: string
  slug: string
  description: string
  price: number
  material: string | null
  dimensions: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  images: ProductImage[]
  colors: { color: Color }[]
  categories: { category: Category }[]
  inventory: Inventory | null
}
```

### CategoryWithChildren

```typescript
{
  id: string
  name: string
  slug: string
  type: CategoryType
  parentId: string | null
  isActive: boolean
  children: Category[]
  parent: Category | null
}
```

### OrderWithRelations

```typescript
{
  id: string
  userId: string
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
  payments: Payment[]
}
```

---

## Implementation Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /api/auth/[...nextauth] | ✅ Implemented | NextAuth handler |
| POST /api/users/register | ✅ Implemented | User registration |
| GET /api/users/profile | ✅ Implemented | Get user profile |
| PUT /api/users/profile | ✅ Implemented | Update user profile |
| GET /api/users | ✅ Implemented | List users (admin) |
| GET /api/products | 🟡 Placeholder | Needs filtering logic |
| POST /api/products | 🟡 Placeholder | Needs implementation |
| GET /api/categories | 🟡 Placeholder | Needs filtering logic |
| POST /api/categories | 🟡 Placeholder | Needs implementation |
| GET /api/orders | 🟡 Placeholder | Needs implementation |
| POST /api/orders | 🟡 Placeholder | Needs order creation logic |
| POST /api/payments | 🟡 Placeholder | Needs gateway integration |
| POST /api/payments/webhook/razorpay | 🟡 Placeholder | Needs webhook verification |
| POST /api/payments/webhook/stripe | 🟡 Placeholder | Needs webhook verification |
| GET /api/cart | 🟡 Placeholder | Needs implementation |
| POST /api/cart | 🟡 Placeholder | Needs implementation |
| PUT /api/cart | 🟡 Placeholder | Needs implementation |
| DELETE /api/cart | 🟡 Placeholder | Needs implementation |

---

## Testing with Postman/Thunder Client

### 1. Authentication

First, authenticate to get a session:

```
POST http://localhost:3000/api/auth/callback/credentials
Content-Type: application/json

{
  "email": "admin@krafted.com",
  "password": "admin123"
}
```

### 2. Test Product Listing

```
GET http://localhost:3000/api/products?page=1&pageSize=20
```

### 3. Test Category Listing

```
GET http://localhost:3000/api/categories?type=ROOM
```

---

## Next Steps for Implementation

1. **Product CRUD**
   - Implement filtering logic
   - Add pagination
   - Handle image uploads to Cloudinary
   - Validate product data

2. **Order Processing**
   - Implement order creation from cart
   - Calculate total amount
   - Reserve inventory
   - Create order snapshots

3. **Payment Integration**
   - Integrate Razorpay SDK
   - Integrate Stripe SDK
   - Implement webhook signature verification
   - Handle payment status updates

4. **Cart Management**
   - Implement add/update/remove logic
   - Handle quantity validation
   - Check inventory availability

---

**Note**: All endpoints currently return placeholder responses. Implement actual business logic based on this specification.

# Database Schema Overview

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Cart : has
    User ||--o{ Order : places
    
    Cart ||--o{ CartItem : contains
    CartItem }o--|| Product : references
    
    Product ||--o{ ProductCategory : "belongs to"
    Product ||--o{ ProductColor : "available in"
    Product ||--o{ ProductImage : has
    Product ||--|| Inventory : tracks
    Product ||--o{ OrderItem : "ordered as"
    
    Category ||--o{ ProductCategory : includes
    Category ||--o{ Category : "parent of"
    
    Color ||--o{ ProductColor : "used by"
    
    Order ||--o{ OrderItem : contains
    Order ||--o{ Payment : "paid via"
    
    User {
        string id PK
        string name
        string email UK
        string password
        enum role
        datetime createdAt
    }
    
    Category {
        string id PK
        string name
        string slug UK
        enum type
        string parentId FK
        boolean isActive
    }
    
    Product {
        string id PK
        string name
        string slug UK
        text description
        decimal price
        string material
        string dimensions
        boolean isActive
    }
    
    Color {
        string id PK
        string name UK
        string hexCode
        boolean isActive
    }
    
    ProductImage {
        string id PK
        string productId FK
        string imageUrl
        string altText
        int priority
        boolean isPrimary
    }
    
    Inventory {
        string productId PK_FK
        int quantity
        int reservedQuantity
    }
    
    Cart {
        string id PK
        string userId FK_UK
    }
    
    CartItem {
        string id PK
        string cartId FK
        string productId FK
        int quantity
    }
    
    Order {
        string id PK
        string userId FK
        decimal totalAmount
        enum status
        enum paymentStatus
        datetime createdAt
    }
    
    OrderItem {
        string id PK
        string orderId FK
        string productId FK
        string productName
        decimal price
        int quantity
    }
    
    Payment {
        string id PK
        string orderId FK
        enum provider
        string paymentIntentId
        string transactionId
        decimal amount
        string currency
        enum status
        json rawResponse
    }
```

## Model Relationships

### User Relationships
- **User → Cart**: One-to-One (one active cart per user)
- **User → Order**: One-to-Many (user can have multiple orders)

### Product Relationships
- **Product ↔ Category**: Many-to-Many via `ProductCategory`
- **Product ↔ Color**: Many-to-Many via `ProductColor`
- **Product → ProductImage**: One-to-Many (multiple images per product)
- **Product → Inventory**: One-to-One (stock tracking)

### Category Relationships
- **Category → Category**: Self-referencing (parent-child hierarchy)
- **Category ↔ Product**: Many-to-Many via `ProductCategory`

### Cart Relationships
- **Cart → CartItem**: One-to-Many (multiple items in cart)
- **CartItem → Product**: Many-to-One (references product)

### Order Relationships
- **Order → OrderItem**: One-to-Many (multiple items per order)
- **Order → Payment**: One-to-Many (multiple payment attempts)
- **OrderItem → Product**: Many-to-One (snapshot reference)

## Key Design Patterns

### 1. Normalized Color System
```
Product ←→ ProductColor ←→ Color
```
- Avoids hardcoded color strings
- Enables consistent filtering
- Centralized color management

### 2. Image Priority System
```
Product → ProductImage (priority: 1-10)
```
- Lower priority number = higher display order
- Flexible image ordering
- Separate `isPrimary` flag

### 3. Category Hierarchy
```
Category (parent) → Category (children)
```
- Self-referencing relationship
- Unlimited nesting depth
- Type-based categorization

### 4. Order Snapshots
```
OrderItem stores: productName, price (at order time)
```
- Historical accuracy
- Prevents data inconsistencies
- Audit trail

### 5. Payment Tracking
```
Order → Payment (multiple attempts)
```
- Separate lifecycle from orders
- Stores raw provider responses
- Supports refunds and reconciliation

## Enums

### UserRole
- `USER` - Regular customer
- `ADMIN` - Administrator

### CategoryType
- `PRODUCT_TYPE` - e.g., Sofa, Chair, Table
- `ROOM` - e.g., Living Room, Bedroom
- `STYLE` - e.g., Modern, Vintage
- `CAMPAIGN` - e.g., Sale, New Arrivals

### OrderStatus
- `CREATED` - Order initiated
- `CONFIRMED` - Payment confirmed
- `SHIPPED` - Order dispatched
- `DELIVERED` - Order completed
- `CANCELLED` - Order cancelled

### PaymentStatus
- `PENDING` - Awaiting payment
- `PAID` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

### PaymentProvider
- `RAZORPAY` - Indian payment gateway
- `STRIPE` - International payment gateway
- `OTHER` - Future providers

### PaymentStatusEnum
- `CREATED` - Payment intent created
- `SUCCESS` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

## Indexes

Optimized for common queries:

```sql
-- Category indexes
CREATE INDEX idx_category_slug ON categories(slug);
CREATE INDEX idx_category_type ON categories(type);
CREATE INDEX idx_category_parent ON categories(parentId);

-- Product indexes
CREATE INDEX idx_product_slug ON products(slug);
CREATE INDEX idx_product_active ON products(isActive);

-- ProductImage indexes
CREATE INDEX idx_product_image_product ON product_images(productId);
CREATE INDEX idx_product_image_priority ON product_images(priority);

-- Order indexes
CREATE INDEX idx_order_user ON orders(userId);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created ON orders(createdAt);

-- Payment indexes
CREATE INDEX idx_payment_order ON payments(orderId);
CREATE INDEX idx_payment_transaction ON payments(transactionId);
```

## Cascade Rules

### Delete Cascades
- Delete User → Deletes Cart, Orders
- Delete Product → Deletes ProductCategory, ProductColor, ProductImage, Inventory, CartItem
- Delete Category → Deletes ProductCategory, Child Categories
- Delete Color → Deletes ProductColor
- Delete Cart → Deletes CartItem
- Delete Order → Deletes OrderItem, Payment

### No Cascade (Preserve References)
- OrderItem → Product (snapshot preserved even if product deleted)

## Database Constraints

### Unique Constraints
- User: `email`
- Category: `slug`
- Product: `slug`
- Color: `name`
- Cart: `userId` (one cart per user)
- CartItem: `(cartId, productId)` (no duplicate products in cart)

### Composite Primary Keys
- ProductCategory: `(productId, categoryId)`
- ProductColor: `(productId, colorId)`

### Foreign Key Constraints
All relationships enforced with foreign keys and appropriate cascade rules.

---

This schema is designed for:
- ✅ Scalability (normalized design)
- ✅ Performance (strategic indexes)
- ✅ Data integrity (constraints and cascades)
- ✅ Flexibility (many-to-many relationships)
- ✅ Historical accuracy (order snapshots)
- ✅ Extensibility (enum types, JSON fields)

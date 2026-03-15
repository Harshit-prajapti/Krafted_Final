# Krafted Furniture - Backend Foundation

A scalable, production-ready backend for a furniture e-commerce platform built with Next.js, PostgreSQL, Prisma, and Cloudinary.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL (Neon - serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth
- **Media Storage**: Cloudinary
- **Payment Gateways**: Razorpay & Stripe (infrastructure ready)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Cloudinary account
- Payment gateway accounts (optional for now)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Payment Gateways (Optional)
# RAZORPAY_KEY_ID="your-razorpay-key-id"
# RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
# STRIPE_SECRET_KEY="your-stripe-secret-key"
# STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

**Important**: 
- Get your Neon database URL from [neon.tech](https://neon.tech)
- Get Cloudinary credentials from [cloudinary.com](https://cloudinary.com)
- Generate NextAuth secret: `openssl rand -base64 32`

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init

# Seed database with initial data
npx prisma db seed
```

This will create:
- Admin user: `admin@krafted.com` / `admin123`
- Base categories (Living Room, Bedroom, etc.)
- Common furniture colors

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
d:\Krafted_Furniture/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── products/     # Product CRUD
│   │   ├── categories/   # Category management
│   │   ├── orders/       # Order processing
│   │   ├── payments/     # Payment handling & webhooks
│   │   └── cart/         # Shopping cart
│   ├── admin/            # Admin dashboard (protected)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── cloudinary.ts     # Cloudinary integration
│   ├── auth.ts           # NextAuth configuration
│   └── env.ts            # Environment validation
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── types/                # TypeScript type definitions
├── config/               # Application constants
└── middleware.ts         # Route protection
```

## 🗄️ Database Schema

### Core Models

- **User**: Authentication and role management (USER/ADMIN)
- **Category**: Hierarchical categories with types (PRODUCT_TYPE, ROOM, STYLE, CAMPAIGN)
- **Product**: Main product entity with relations
- **Color**: Normalized color system
- **ProductImage**: Image metadata with priority system (1-10)
- **Inventory**: Stock tracking
- **Cart & CartItem**: Shopping cart management
- **Order & OrderItem**: Order processing with snapshots
- **Payment**: Payment gateway tracking

### Key Features

✅ **Normalized Color System**: Separate Color table for scalable management  
✅ **Image Priority**: 1-10 ranking system (lower = higher priority)  
✅ **Category Types**: Flexible organization (product type, room, style, campaign)  
✅ **Payment Tracking**: Supports multiple payment attempts per order  
✅ **Order Snapshots**: Prevents data inconsistencies from future product changes  
✅ **No Images in DB**: Only metadata stored, images in Cloudinary  

## 🔐 Authentication

- **Admin User**: `admin@krafted.com` / `admin123` (created during seeding)
- **Protected Routes**: `/admin/*` routes require ADMIN role
- **Middleware**: Automatic route protection configured

## 🎨 Design Decisions

### Why Normalized Colors?
Instead of storing color strings in products, we use a separate Color table. This allows:
- Consistent color naming across products
- Easy filtering by color
- Centralized color management
- Support for hex codes for future UI

### Why Image Priority?
Products can have multiple images. Priority (1-10) determines display order:
- Lower number = higher priority
- Primary image can be marked separately
- Flexible ordering for product galleries

### Why Category Types?
Categories serve multiple purposes:
- **PRODUCT_TYPE**: Sofas, Chairs, Tables
- **ROOM**: Living Room, Bedroom
- **STYLE**: Modern, Vintage
- **CAMPAIGN**: Sale, New Arrivals

This enables flexible product organization and filtering.

### Why Separate Payment Table?
- Tracks all payment gateway interactions
- Supports multiple payment attempts per order
- Stores raw provider responses for debugging
- Enables payment reconciliation

## 🚦 API Routes (Structure Ready)

All API routes are created with placeholder implementations:

- `GET /api/products` - List products with filters
- `POST /api/products` - Create product (admin only)
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin only)
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create order
- `POST /api/payments` - Create payment intent
- `POST /api/payments/webhook/razorpay` - Razorpay webhook
- `POST /api/payments/webhook/stripe` - Stripe webhook
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove from cart

## 🔧 Useful Commands

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Check TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

## 📦 Deployment (Vercel-Ready)

The architecture is designed for Vercel deployment:
- Stateless backend design
- Environment-based configuration
- Serverless PostgreSQL (Neon)
- External media storage (Cloudinary)

## 🎯 Next Steps

1. **Configure Environment**: Set up your `.env` file with actual credentials
2. **Run Migrations**: Execute database setup commands
3. **Test API Routes**: Use Postman/Thunder Client to test endpoints
4. **Implement Business Logic**: Add actual implementations to API routes
5. **Frontend Development**: Build UI components (not included in this phase)

## ⚠️ Important Notes

- **No Frontend UI**: This phase focuses on backend infrastructure only
- **Payment Gateways**: Infrastructure ready, but not fully implemented
- **Admin Password**: Change default admin password in production
- **Environment Variables**: Never commit `.env` file to version control

## 📝 License

This project is part of Krafted Furniture e-commerce platform.

---

**Status**: ✅ Backend foundation complete and ready for frontend development

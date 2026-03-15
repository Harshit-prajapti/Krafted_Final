# 🚀 Quick Setup Guide

Follow these steps to get your Krafted Furniture backend up and running.

## Step 1: Environment Configuration

You need to create a `.env` file in the root directory. Copy the content from `.env.example`:

```bash
# On Windows PowerShell
Copy-Item .env.example .env

# On macOS/Linux
cp .env.example .env
```

Then edit `.env` and fill in your actual credentials:

### 1.1 Database URL (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:pass@host/db?sslmode=require`)
4. Paste it in your `.env` file as `DATABASE_URL`

### 1.2 NextAuth Secret

Generate a secure random string:

```bash
# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On macOS/Linux
openssl rand -base64 32
```

Paste the output as `NEXTAUTH_SECRET` in your `.env` file.

### 1.3 Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Paste them in your `.env` file

### 1.4 Payment Gateways (Optional)

You can skip these for now. They're commented out in `.env.example`.

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, NextAuth, etc.

## Step 3: Set Up Database

Run these commands in order:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Create database tables
npx prisma migrate dev --name init

# 3. Seed initial data
npx prisma db seed
```

**What gets seeded:**
- Admin user: `admin@krafted.com` / `admin123`
- 18 categories (Living Room, Bedroom, Sofas, Chairs, Modern, etc.)
- 8 common furniture colors (Walnut Brown, Oak Natural, etc.)

## Step 4: Verify Setup

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens a browser at `http://localhost:5555` where you can see all your tables and seeded data.

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see: "Krafted Furniture - Backend infrastructure ready. Frontend to be implemented."

## ✅ Verification Checklist

- [ ] `.env` file created with all required variables
- [ ] Database connection successful
- [ ] Prisma migration completed
- [ ] Database seeded (check with `npx prisma studio`)
- [ ] Development server running without errors
- [ ] Can access `http://localhost:3000`

## 🐛 Troubleshooting

### Error: "Environment variable not found"

Make sure your `.env` file exists and contains all required variables. The `lib/env.ts` file validates them on startup.

### Error: "Can't reach database server"

- Check your `DATABASE_URL` is correct
- Ensure your Neon database is active
- Verify your internet connection

### Error: "Prisma Client not generated"

Run: `npx prisma generate`

### Migration fails

Try resetting the database:
```bash
npx prisma migrate reset
```

This will drop all tables and re-run migrations.

## 📚 Next Steps

1. **Test API Endpoints**: Use Postman or Thunder Client to test the API routes
2. **Explore Database**: Use Prisma Studio to understand the schema
3. **Read the Schema**: Check `prisma/schema.prisma` to see all models
4. **Implement Business Logic**: Start adding actual implementations to API routes

## 🔗 Useful Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [NextAuth.js](https://next-auth.js.org/)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)

---

Need help? Check the main [README.md](./README.md) for detailed architecture information.

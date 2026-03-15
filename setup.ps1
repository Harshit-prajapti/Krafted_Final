# Quick Setup Script for Krafted Furniture Backend
# Run this script to set up your development environment

Write-Host "🚀 Krafted Furniture - Quick Setup" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Step 1: Check if .env exists
Write-Host "Step 1: Checking environment configuration..." -ForegroundColor Yellow
if (-Not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📝 Creating .env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: You need to edit .env and add your credentials:" -ForegroundColor Yellow
    Write-Host "   1. DATABASE_URL - Get from https://neon.tech" -ForegroundColor White
    Write-Host "   2. NEXTAUTH_SECRET - Generate with: openssl rand -base64 32" -ForegroundColor White
    Write-Host "   3. CLOUDINARY credentials - Get from https://cloudinary.com" -ForegroundColor White
    Write-Host ""
    Write-Host "For quick testing, you can use SQLite instead of PostgreSQL:" -ForegroundColor Cyan
    Write-Host "   DATABASE_URL=`"file:./dev.db`"" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter after you've updated .env file..." -ForegroundColor Yellow
    Read-Host
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

# Step 2: Generate Prisma Client
Write-Host "`nStep 2: Generating Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma Client generated successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Run database migration
Write-Host "`nStep 3: Creating database tables..." -ForegroundColor Yellow
$response = Read-Host "Do you want to run database migration? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    try {
        npx prisma migrate dev --name init
        Write-Host "✅ Database tables created!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Migration failed" -ForegroundColor Red
        Write-Host "Make sure your DATABASE_URL is correct in .env" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping migration" -ForegroundColor Yellow
}

# Step 4: Seed database
Write-Host "`nStep 4: Seeding database with initial data..." -ForegroundColor Yellow
$response = Read-Host "Do you want to seed the database? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    try {
        npx prisma db seed
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Seeded data:" -ForegroundColor Cyan
        Write-Host "   - Admin user: admin@krafted.com / admin123" -ForegroundColor White
        Write-Host "   - 18 categories (Living Room, Bedroom, Sofas, etc.)" -ForegroundColor White
        Write-Host "   - 8 colors (Walnut Brown, Oak Natural, etc.)" -ForegroundColor White
    } catch {
        Write-Host "❌ Seeding failed" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Skipping seeding" -ForegroundColor Yellow
}

# Step 5: Open Prisma Studio
Write-Host "`nStep 5: View your database..." -ForegroundColor Yellow
$response = Read-Host "Do you want to open Prisma Studio to view your database? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🔍 Opening Prisma Studio at http://localhost:5555" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to close Prisma Studio when done" -ForegroundColor Yellow
    npx prisma studio
} else {
    Write-Host "⏭️  Skipping Prisma Studio" -ForegroundColor Yellow
}

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "🎉 Your backend is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Check: README.md for full documentation" -ForegroundColor White
Write-Host ""

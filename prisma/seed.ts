import { PrismaClient, UserRole, VendorStatus, CategoryType, OrderStatus, PaymentStatus, ShippingStatus, AddressType, PaymentProvider, PaymentStatusEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Utility for slugifying
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.paymentHistory.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderHistory.deleteMany();
    await prisma.shipping.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.vendorReview.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.categoryRelation.deleteMany();
    await prisma.category.deleteMany();
    await prisma.color.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // 1. Create Users
    console.log('👤 Creating users...');
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Mankind@1134';
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@krafted.com',
            password: hashedAdminPassword,
            role: UserRole.ADMIN,
            phone: '+91 9876543210',
        },
    });

    const vendor1User = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@vendor.com',
            password: hashedPassword,
            role: UserRole.VENDOR,
            phone: '+91 9876543211',
        },
    });

    const vendor2User = await prisma.user.create({
        data: {
            name: 'Jane Smith',
            email: 'jane@vendor.com',
            password: hashedPassword,
            role: UserRole.VENDOR,
            phone: '+91 9876543212',
        },
    });

    const customer1 = await prisma.user.create({
        data: {
            name: 'Alice Johnson',
            email: 'alice@customer.com',
            password: hashedPassword,
            role: UserRole.USER,
            phone: '+91 9876543213',
        },
    });

    const customer2 = await prisma.user.create({
        data: {
            name: 'Bob Williams',
            email: 'bob@customer.com',
            password: hashedPassword,
            role: UserRole.USER,
            phone: '+91 9876543214',
        },
    });

    console.log('✅ Created 5 users');

    // 2. Create Vendors
    console.log('🏪 Creating vendors...');
    const vendor1 = await prisma.vendor.create({
        data: {
            userId: vendor1User.id,
            businessName: 'Luxury Furniture Co.',
            description: 'Premium handcrafted furniture for modern homes',
            logo: 'https://res.cloudinary.com/demo/image/upload/v1/vendors/luxury-furniture-logo.jpg',
            banner: 'https://res.cloudinary.com/demo/image/upload/v1/vendors/luxury-furniture-banner.jpg',
            status: VendorStatus.APPROVED,
            commission: 10.00,
        },
    });

    const vendor2 = await prisma.vendor.create({
        data: {
            userId: vendor2User.id,
            businessName: 'Vintage Classics',
            description: 'Authentic vintage and antique furniture pieces',
            logo: 'https://res.cloudinary.com/demo/image/upload/v1/vendors/vintage-classics-logo.jpg',
            banner: 'https://res.cloudinary.com/demo/image/upload/v1/vendors/vintage-classics-banner.jpg',
            status: VendorStatus.APPROVED,
            commission: 12.00,
        },
    });

    console.log('✅ Created 2 vendors');

    // 3. Create Addresses
    console.log('📍 Creating addresses...');
    const address1 = await prisma.address.create({
        data: {
            userId: customer1.id,
            type: AddressType.BOTH,
            firstName: 'Alice',
            lastName: 'Johnson',
            addressLine1: '123 Main Street',
            addressLine2: 'Apt 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'IN',
            phone: '+91 9876543213',
            isDefault: true,
        },
    });

    const address2 = await prisma.address.create({
        data: {
            userId: customer2.id,
            type: AddressType.SHIPPING,
            firstName: 'Bob',
            lastName: 'Williams',
            addressLine1: '456 Park Avenue',
            city: 'Delhi',
            state: 'Delhi',
            postalCode: '110001',
            country: 'IN',
            phone: '+91 9876543214',
            isDefault: true,
        },
    });

    console.log('✅ Created 2 addresses');

    // 4. Create Categories
    console.log('📂 Creating categories...');
    const livingRoom = await prisma.category.create({
        data: {
            name: 'Living Room',
            slug: 'living-room',
            type: CategoryType.ROOM,
        },
    });

    const bedroom = await prisma.category.create({
        data: {
            name: 'Bedroom',
            slug: 'bedroom',
            type: CategoryType.ROOM,
        },
    });

    const sofa = await prisma.category.create({
        data: {
            name: 'Sofas',
            slug: 'sofas',
            type: CategoryType.PRODUCT_TYPE,
        },
    });

    const bed = await prisma.category.create({
        data: {
            name: 'Beds',
            slug: 'beds',
            type: CategoryType.PRODUCT_TYPE,
        },
    });

    const modern = await prisma.category.create({
        data: {
            name: 'Modern',
            slug: 'modern',
            type: CategoryType.STYLE,
        },
    });

    const vintage = await prisma.category.create({
        data: {
            name: 'Vintage',
            slug: 'vintage',
            type: CategoryType.STYLE,
        },
    });

    // Create category relations (many-to-many hierarchy)
    await prisma.categoryRelation.createMany({
        data: [
            { parentId: livingRoom.id, childId: sofa.id },
            { parentId: bedroom.id, childId: bed.id },
        ],
    });

    console.log('✅ Created 6 categories with relations');

    // 5. Create Colors
    console.log('🎨 Creating colors...');
    const colors = await prisma.color.createMany({
        data: [
            { name: 'Walnut Brown', hexCode: '#8B4513' },
            { name: 'Ivory White', hexCode: '#FFFFF0' },
            { name: 'Charcoal Gray', hexCode: '#36454F' },
            { name: 'Navy Blue', hexCode: '#000080' },
            { name: 'Emerald Green', hexCode: '#50C878' },
        ],
    });

    const colorRecords = await prisma.color.findMany();

    console.log('✅ Created 5 colors');

    // 6. Create Products with Variants
    console.log('🛋️  Creating products...');
    const product1 = await prisma.product.create({
        data: {
            vendorId: vendor1.id,
            name: 'Modern L-Shaped Sofa',
            slug: 'modern-l-shaped-sofa',
            description: 'Luxurious L-shaped sofa with premium fabric upholstery. Perfect for modern living rooms.',
            basePrice: 89999.00,
            material: 'Premium Fabric',
            dimensions: '280x180x85 cm',
            weight: 120.5,
            categories: {
                create: [
                    { categoryId: sofa.id },
                    { categoryId: livingRoom.id },
                    { categoryId: modern.id },
                ],
            },
            images: {
                create: [
                    {
                        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/products/sofa-1-main.jpg',
                        altText: 'Modern L-Shaped Sofa - Main View',
                        priority: 1,
                        isPrimary: true,
                    },
                    {
                        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/products/sofa-1-side.jpg',
                        altText: 'Modern L-Shaped Sofa - Side View',
                        priority: 2,
                    },
                ],
            },
            variants: {
                create: [
                    {
                        sku: 'SOFA-L-GRAY-001',
                        colorId: colorRecords.find(c => c.name === 'Charcoal Gray')?.id,
                        size: 'Standard',
                        price: 89999.00,
                    },
                    {
                        sku: 'SOFA-L-NAVY-001',
                        colorId: colorRecords.find(c => c.name === 'Navy Blue')?.id,
                        size: 'Standard',
                        price: 92999.00,
                    },
                ],
            },
        },
    });

    const product2 = await prisma.product.create({
        data: {
            vendorId: vendor1.id,
            name: 'King Size Platform Bed',
            slug: 'king-size-platform-bed',
            description: 'Elegant king-size platform bed with solid wood frame and upholstered headboard.',
            basePrice: 65999.00,
            material: 'Solid Oak Wood',
            dimensions: '200x180x120 cm',
            weight: 95.0,
            categories: {
                create: [
                    { categoryId: bed.id },
                    { categoryId: bedroom.id },
                    { categoryId: modern.id },
                ],
            },
            images: {
                create: [
                    {
                        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/products/bed-1-main.jpg',
                        altText: 'King Size Platform Bed - Main View',
                        priority: 1,
                        isPrimary: true,
                    },
                ],
            },
            variants: {
                create: [
                    {
                        sku: 'BED-KING-WALNUT-001',
                        colorId: colorRecords.find(c => c.name === 'Walnut Brown')?.id,
                        size: 'King',
                        price: 65999.00,
                    },
                    {
                        sku: 'BED-KING-IVORY-001',
                        colorId: colorRecords.find(c => c.name === 'Ivory White')?.id,
                        size: 'King',
                        price: 67999.00,
                    },
                ],
            },
        },
    });

    const product3 = await prisma.product.create({
        data: {
            vendorId: vendor2.id,
            name: 'Vintage Chesterfield Sofa',
            slug: 'vintage-chesterfield-sofa',
            description: 'Classic Chesterfield sofa with genuine leather upholstery and button tufting.',
            basePrice: 125999.00,
            material: 'Genuine Leather',
            dimensions: '220x90x75 cm',
            weight: 85.0,
            categories: {
                create: [
                    { categoryId: sofa.id },
                    { categoryId: livingRoom.id },
                    { categoryId: vintage.id },
                ],
            },
            images: {
                create: [
                    {
                        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/products/sofa-vintage-main.jpg',
                        altText: 'Vintage Chesterfield Sofa',
                        priority: 1,
                        isPrimary: true,
                    },
                ],
            },
            variants: {
                create: [
                    {
                        sku: 'SOFA-CHEST-BROWN-001',
                        colorId: colorRecords.find(c => c.name === 'Walnut Brown')?.id,
                        size: '3-Seater',
                        price: 125999.00,
                    },
                ],
            },
        },
    });

    console.log('✅ Created 3 products with variants');

    // 6b. Create Featured Products (from home page)
    console.log('🌟 Creating featured products...');

    const dining = await prisma.category.upsert({
        where: { slug: 'dining' },
        update: {},
        create: { name: 'Dining', slug: 'dining', type: CategoryType.ROOM },
    });

    const armchairs = await prisma.category.upsert({
        where: { slug: 'armchairs' },
        update: {},
        create: { name: 'Armchairs', slug: 'armchairs', type: CategoryType.PRODUCT_TYPE },
    });

    const decor = await prisma.category.upsert({
        where: { slug: 'decor' },
        update: {},
        create: { name: 'Decor', slug: 'decor', type: CategoryType.PRODUCT_TYPE },
    });

    const featuredProducts = [
        {
            name: 'Royal Velvet Throne Sofa',
            slug: 'royal-throne-sofa',
            description: 'Luxurious velvet throne sofa with gold accents. A statement piece for your living room.',
            basePrice: 5200,
            image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1000&auto=format&fit=crop',
            category: livingRoom.id,
        },
        {
            name: 'Victorian Gold Trim Sofa',
            slug: 'victorian-gold-sofa',
            description: 'Classic Victorian style sofa with intricate gold trim and premium upholstery.',
            basePrice: 4800,
            image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1000&auto=format&fit=crop',
            category: livingRoom.id,
        },
        {
            name: 'Imperial Mahogany Dining Table',
            slug: 'imperial-mahogany-table',
            description: 'Stunning mahogany dining table with carved legs. Seats 8 comfortably.',
            basePrice: 6200,
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
            category: dining.id,
        },
        {
            name: 'Baroque Carved Dining Chair',
            slug: 'baroque-dining-chair',
            description: 'Elegantly carved dining chair with baroque design and velvet seating.',
            basePrice: 1350,
            image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1000&auto=format&fit=crop',
            category: dining.id,
        },
        {
            name: 'Regal Tufted Wingback Chair',
            slug: 'regal-wingback-chair',
            description: 'Classic wingback chair with button tufting and rolled arms.',
            basePrice: 1750,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
            category: armchairs.id,
        },
        {
            name: 'Classic Leather Chesterfield',
            slug: 'chesterfield-sofa',
            description: 'Timeless Chesterfield sofa in rich leather with deep button tufting.',
            basePrice: 4100,
            image: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?q=80&w=1000&auto=format&fit=crop',
            category: livingRoom.id,
        },
        {
            name: 'Royal Canopy King Bed',
            slug: 'royal-canopy-bed',
            description: 'Majestic canopy bed with ornate posts and luxurious draping.',
            basePrice: 7500,
            image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop',
            category: bedroom.id,
        },
        {
            name: 'Hand-Carved Palace Bed Frame',
            slug: 'palace-bed-frame',
            description: 'Exquisite hand-carved bed frame with intricate detailing.',
            basePrice: 6900,
            image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
            category: bedroom.id,
        },
        {
            name: 'Marble Top Royal Coffee Table',
            slug: 'royal-coffee-table',
            description: 'Elegant coffee table with genuine marble top and gold-finished frame.',
            basePrice: 2100,
            image: 'https://images.pexels.com/photos/3773570/pexels-photo-3773570.png',
            category: livingRoom.id,
        },
        {
            name: 'Antique Gold Accent Console',
            slug: 'gold-accent-console',
            description: 'Stunning console table with antique gold finish and mirrored shelves.',
            basePrice: 2950,
            image: 'https://images.pexels.com/photos/6538945/pexels-photo-6538945.jpeg',
            category: decor.id,
        },
        {
            name: 'Royal Upholstered Ottoman',
            slug: 'royal-ottoman',
            description: 'Luxurious ottoman with tufted top and solid wood legs.',
            basePrice: 980,
            image: 'https://images.pexels.com/photos/6969866/pexels-photo-6969866.jpeg',
            category: livingRoom.id,
        },
        {
            name: 'Luxury Palace Side Table',
            slug: 'palace-side-table',
            description: 'Elegant side table with ornate carved details and marble inlay.',
            basePrice: 1650,
            image: 'https://images.pexels.com/photos/7031737/pexels-photo-7031737.jpeg',
            category: bedroom.id,
        },
    ];

    for (const fp of featuredProducts) {
        await prisma.product.upsert({
            where: { slug: fp.slug },
            update: {},
            create: {
                vendorId: vendor1.id,
                name: fp.name,
                slug: fp.slug,
                description: fp.description,
                basePrice: fp.basePrice,
                material: 'Premium Materials',
                categories: {
                    create: [{ categoryId: fp.category }],
                },
                images: {
                    create: [{
                        imageUrl: fp.image,
                        altText: fp.name,
                        priority: 1,
                        isPrimary: true,
                    }],
                },
                variants: {
                    create: [{
                        sku: `${fp.slug.toUpperCase().replace(/-/g, '-')}-001`,
                        colorId: colorRecords.find(c => c.name === 'Walnut Brown')?.id,
                        size: 'Standard',
                        price: fp.basePrice,
                    }],
                },
            },
        });
    }

    console.log('✅ Created 12 featured products');

    // 6c. Dynamic Seeding from migrated images
    console.log('📂 Starting dynamic seeding from images...');
    const productsBaseDir = path.join(process.cwd(), 'public', 'images', 'products');

    if (fs.existsSync(productsBaseDir)) {
        const categories = fs.readdirSync(productsBaseDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        // Helper for recursive image search
        const getAllImages = (dir: string, baseDir: string): string[] => {
            let results: string[] = [];
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                file = path.resolve(dir, file);
                const stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    results = results.concat(getAllImages(file, baseDir));
                } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
                    results.push(path.relative(baseDir, file).replace(/\\/g, '/'));
                }
            });
            return results;
        };

        for (const catFolder of categories) {
            console.log(`📁 Processing category: ${catFolder}`);

            // Upsert Category
            const categoryName = catFolder.charAt(0).toUpperCase() + catFolder.slice(1).replace(/-/g, ' ');
            const categorySlug = slugify(catFolder);

            const category = await prisma.category.upsert({
                where: { slug: categorySlug },
                update: {},
                create: {
                    name: categoryName,
                    slug: categorySlug,
                    type: CategoryType.PRODUCT_TYPE,
                },
            });

            const categoryDir = path.join(productsBaseDir, catFolder);
            const relativeImagePaths = getAllImages(categoryDir, productsBaseDir);

            for (const relPath of relativeImagePaths) {
                // filename is the last part
                const filename = path.basename(relPath);
                const productName = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '')
                    .replace(/[-_]/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                const productSlug = slugify(`${categorySlug}-${productName}-${Math.random().toString(36).substring(7)}`);
                const price = Math.floor(Math.random() * (150000 - 15000 + 1)) + 15000;

                await prisma.product.upsert({
                    where: { slug: productSlug },
                    update: {},
                    create: {
                        vendorId: vendor1.id,
                        name: productName,
                        slug: productSlug,
                        description: `Luxury ${productName} from our ${categoryName} collection. Exquisite craftsmanship and premium materials.`,
                        basePrice: price,
                        material: 'Premium Materials',
                        categories: {
                            create: [{ categoryId: category.id }],
                        },
                        images: {
                            create: [{
                                imageUrl: `/images/products/${relPath}`,
                                altText: productName,
                                priority: 1,
                                isPrimary: true,
                            }],
                        },
                        variants: {
                            create: [{
                                sku: `${slugify(productName).toUpperCase()}-${Math.random().toString(36).substring(7)}`,
                                colorId: colorRecords[Math.floor(Math.random() * colorRecords.length)].id,
                                size: 'Standard',
                                price: price,
                            }],
                        },
                    },
                });
            }
        }
    }
    console.log('✅ Dynamic seeding completed');

    // 7. Create Reviews
    console.log('⭐ Creating reviews...');
    await prisma.review.createMany({
        data: [
            {
                productId: product1.id,
                userId: customer1.id,
                rating: 5,
                comment: 'Absolutely love this sofa! Perfect for my living room.',
            },
            {
                productId: product2.id,
                userId: customer2.id,
                rating: 4,
                comment: 'Great bed, very comfortable. Delivery was a bit delayed though.',
            },
        ],
    });

    await prisma.vendorReview.create({
        data: {
            vendorId: vendor1.id,
            userId: customer1.id,
            rating: 5,
            comment: 'Excellent service and quality products!',
        },
    });

    console.log('✅ Created reviews');

    // 8. Create Wishlist
    console.log('❤️  Creating wishlist items...');
    await prisma.wishlistItem.createMany({
        data: [
            {
                userId: customer1.id,
                productId: product3.id,
            },
            {
                userId: customer2.id,
                productId: product1.id,
            },
        ],
    });

    console.log('✅ Created wishlist items');

    // 9. Create Cart
    console.log('🛒 Creating carts...');
    const cart1 = await prisma.cart.create({
        data: {
            userId: customer1.id,
        },
    });

    const variant1 = await prisma.productVariant.findFirst({
        where: { productId: product1.id },
    });

    if (variant1) {
        await prisma.cartItem.create({
            data: {
                cartId: cart1.id,
                productId: product1.id,
                variantId: variant1.id,
                quantity: 1,
            },
        });
    }

    console.log('✅ Created cart with items');

    // 10. Create Orders
    console.log('📦 Creating orders...');
    const order1 = await prisma.order.create({
        data: {
            userId: customer1.id,
            shippingAddressId: address1.id,
            billingAddressId: address1.id,
            totalAmount: 89999.00,
            status: OrderStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
            items: {
                create: [
                    {
                        productId: product1.id,
                        variantId: variant1?.id,
                        productName: 'Modern L-Shaped Sofa',
                        sku: variant1?.sku,
                        colorName: 'Charcoal Gray',
                        size: 'Standard',
                        price: 89999.00,
                        quantity: 1,
                    },
                ],
            },
            payments: {
                create: {
                    provider: PaymentProvider.RAZORPAY,
                    transactionId: 'pay_' + Date.now(),
                    amount: 89999.00,
                    currency: 'INR',
                    status: PaymentStatusEnum.SUCCESS,
                },
            },
            shipping: {
                create: {
                    trackingNumber: 'TRACK' + Date.now(),
                    carrier: 'Blue Dart',
                    status: ShippingStatus.SHIPPED,
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            },
            history: {
                create: [
                    {
                        status: OrderStatus.CREATED,
                        notes: 'Order placed',
                    },
                    {
                        status: OrderStatus.CONFIRMED,
                        notes: 'Payment confirmed',
                    },
                ],
            },
        },
    });

    console.log('✅ Created orders with shipping and history');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- 5 Users (1 Admin, 2 Vendors, 2 Customers)');
    console.log('- 2 Vendors (Approved)');
    console.log('- 2 Addresses');
    console.log('- 6 Categories with relations');
    console.log('- 5 Colors');
    console.log('- 3 Products with variants');
    console.log('- Reviews and vendor reviews');
    console.log('- Wishlist items');
    console.log('- Cart with items');
    console.log('- 1 Order with shipping and history');
    console.log('\n🔐 Login Credentials:');
    console.log(`Admin: admin@krafted.com / ${adminPassword}`);
    console.log('Vendor 1: john@vendor.com / password123');
    console.log('Vendor 2: jane@vendor.com / password123');
    console.log('Customer 1: alice@customer.com / password123');
    console.log('Customer 2: bob@customer.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

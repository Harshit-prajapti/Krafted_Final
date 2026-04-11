require('dotenv').config({ path: '.env' })

const bcrypt = require('bcryptjs')
const { PrismaClient, UserRole } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@krafted.com'
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Mankind@1134'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    create: {
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  console.log(`Admin account ready for ${admin.email} (${admin.role})`)
}

main()
  .catch((error) => {
    console.error('Failed to sync admin account:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

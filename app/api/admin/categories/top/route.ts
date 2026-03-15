import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const categoryStats = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            _count: true
        })

        const productIds = categoryStats.map(s => s.productId)

        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                categories: {
                    include: {
                        category: { select: { id: true, name: true, type: true } }
                    }
                }
            }
        })

        const categoryTotals: Record<string, { name: string; total: number }> = {}

        categoryStats.forEach(stat => {
            const product = products.find(p => p.id === stat.productId)
            if (product) {
                product.categories.forEach(pc => {
                    if (pc.category.type === 'ROOM') {
                        const catName = pc.category.name
                        if (!categoryTotals[catName]) {
                            categoryTotals[catName] = { name: catName, total: 0 }
                        }
                        categoryTotals[catName].total += stat._sum.quantity || 0
                    }
                })
            }
        })

        const sorted = Object.values(categoryTotals)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)

        const grandTotal = sorted.reduce((sum, cat) => sum + cat.total, 0)

        const result = sorted.map(cat => ({
            name: cat.name,
            percentage: grandTotal > 0 ? Math.round((cat.total / grandTotal) * 100) : 0,
            total: cat.total
        }))

        if (result.length === 0) {
            const defaultCategories = await prisma.category.findMany({
                where: { type: 'ROOM', isActive: true },
                take: 3,
                select: { name: true }
            })

            return NextResponse.json(
                defaultCategories.map(cat => ({
                    name: cat.name,
                    percentage: 0,
                    total: 0
                }))
            )
        }

        return NextResponse.json(result)

    } catch (error) {
        console.error('[ADMIN_TOP_CATEGORIES_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

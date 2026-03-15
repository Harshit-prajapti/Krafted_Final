import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const categoryIds = searchParams.getAll('categoryId')
        const excludeId = searchParams.get('excludeId')
        const limit = parseInt(searchParams.get('limit') || '8')

        if (categoryIds.length === 0) {
            return NextResponse.json({ products: [] })
        }

        const products = await prisma.product.findMany({
            where: {
                AND: [
                    {
                        categories: {
                            some: {
                                categoryId: {
                                    in: categoryIds
                                }
                            }
                        }
                    },
                    excludeId ? { id: { not: excludeId } } : {},
                    { isActive: true }
                ]
            },
            include: {
                images: {
                    take: 1,
                    orderBy: { priority: 'asc' }
                },
                categories: {
                    include: {
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ products })
    } catch (error) {
        console.error('Error fetching related products:', error)
        return NextResponse.json(
            { error: 'Failed to fetch related products' },
            { status: 500 }
        )
    }
}

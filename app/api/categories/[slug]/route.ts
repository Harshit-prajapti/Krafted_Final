import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getImmediateChildCategorySummaries, getProductsForCategoryBranch } from "@/lib/category-queries";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const { searchParams } = request.nextUrl
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '12')
        const skip = (page - 1) * pageSize

        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                children: true,
            }
        })

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }

        const [{ products, total }, children] = await Promise.all([
            getProductsForCategoryBranch({
                categoryId: category.id,
                page,
                pageSize,
            }),
            getImmediateChildCategorySummaries(category.id),
        ])

        return NextResponse.json({
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                children,
            },
            products,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        })
    } catch (error) {
        console.error('[CATEGORY_GET_ERROR]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

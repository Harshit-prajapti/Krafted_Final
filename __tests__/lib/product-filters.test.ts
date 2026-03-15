import { buildProductWhereClause, ProductFilterParams } from '@/lib/product-filters'

describe('buildProductWhereClause', () => {
    // ── Default behaviour ─────────────────────────────────────────
    it('returns { isActive: true } when no params given', () => {
        const result = buildProductWhereClause({})
        expect(result).toEqual({ isActive: true })
    })

    // ── isActive override ─────────────────────────────────────────
    it('allows overriding isActive to false', () => {
        const result = buildProductWhereClause({ isActive: 'false' })
        expect(result.isActive).toBe(false)
    })

    it('sets isActive to true when isActive param is "true"', () => {
        const result = buildProductWhereClause({ isActive: 'true' })
        expect(result.isActive).toBe(true)
    })

    // ── Category filter ───────────────────────────────────────────
    it('builds single categoryId filter', () => {
        const result = buildProductWhereClause({ categoryId: 'cat-1' })
        expect(result.categories).toEqual({
            some: { categoryId: { in: ['cat-1'] } }
        })
    })

    it('builds multiple categoryId filter', () => {
        const result = buildProductWhereClause({ categoryId: ['cat-1', 'cat-2'] })
        expect(result.categories).toEqual({
            some: { categoryId: { in: ['cat-1', 'cat-2'] } }
        })
    })

    // ── Color filter ──────────────────────────────────────────────
    it('builds single colorId filter', () => {
        const result = buildProductWhereClause({ colorId: 'clr-1' })
        expect(result.variants).toEqual({
            some: { colorId: { in: ['clr-1'] } }
        })
    })

    it('builds multiple colorId filter', () => {
        const result = buildProductWhereClause({ colorId: ['clr-1', 'clr-2'] })
        expect(result.variants).toEqual({
            some: { colorId: { in: ['clr-1', 'clr-2'] } }
        })
    })

    // ── Material filter ───────────────────────────────────────────
    it('builds single material filter', () => {
        const result = buildProductWhereClause({ material: 'Wood' })
        expect(result.material).toEqual({ in: ['Wood'] })
    })

    it('builds multiple material filter', () => {
        const result = buildProductWhereClause({ material: ['Wood', 'Metal'] })
        expect(result.material).toEqual({ in: ['Wood', 'Metal'] })
    })

    // ── Vendor filter ─────────────────────────────────────────────
    it('builds vendorId filter', () => {
        const result = buildProductWhereClause({ vendorId: 'v-1' })
        expect(result.vendorId).toBe('v-1')
    })

    // ── Price range filter ────────────────────────────────────────
    it('builds minPrice only', () => {
        const result = buildProductWhereClause({ minPrice: '100' })
        expect(result.basePrice).toEqual({ gte: 100 })
    })

    it('builds maxPrice only', () => {
        const result = buildProductWhereClause({ maxPrice: '5000' })
        expect(result.basePrice).toEqual({ lte: 5000 })
    })

    it('builds min + max price range', () => {
        const result = buildProductWhereClause({ minPrice: '100', maxPrice: '5000' })
        expect(result.basePrice).toEqual({ gte: 100, lte: 5000 })
    })

    // ── Search filter ─────────────────────────────────────────────
    it('builds search OR clause for name and description', () => {
        const result = buildProductWhereClause({ search: 'chair' })
        expect(result.OR).toEqual([
            { name: { contains: 'chair', mode: 'insensitive' } },
            { description: { contains: 'chair', mode: 'insensitive' } }
        ])
    })

    // ── Combined filters ──────────────────────────────────────────
    it('builds combined filter with multiple params', () => {
        const params: ProductFilterParams = {
            categoryId: 'cat-1',
            colorId: 'clr-1',
            vendorId: 'v-1',
            minPrice: '500',
            maxPrice: '10000',
            search: 'modern',
        }
        const result = buildProductWhereClause(params)

        expect(result.isActive).toBe(true)
        expect(result.categories).toBeDefined()
        expect(result.variants).toBeDefined()
        expect(result.vendorId).toBe('v-1')
        expect(result.basePrice).toEqual({ gte: 500, lte: 10000 })
        expect(result.OR).toBeDefined()
    })

    // ── Null / undefined params are ignored ───────────────────────
    it('ignores null/undefined optional params', () => {
        const result = buildProductWhereClause({
            categoryId: null,
            colorId: null,
            vendorId: null,
            minPrice: null,
            maxPrice: null,
            search: null,
        })
        expect(result).toEqual({ isActive: true })
    })
})

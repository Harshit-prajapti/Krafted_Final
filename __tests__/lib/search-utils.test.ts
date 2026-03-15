import {
    levenshteinDistance,
    calculateSimilarity,
    calculateRelevanceScore,
    highlightMatch,
    getDidYouMeanSuggestion,
    saveSearchToHistory,
    getSearchHistory,
    clearSearchHistory,
} from '@/lib/search-utils'

// ── levenshteinDistance ──────────────────────────────────────────
describe('levenshteinDistance', () => {
    it('returns 0 for identical strings', () => {
        expect(levenshteinDistance('hello', 'hello')).toBe(0)
    })

    it('returns length of non-empty string when compared to empty string', () => {
        expect(levenshteinDistance('', 'abc')).toBe(3)
        expect(levenshteinDistance('abc', '')).toBe(3)
    })

    it('returns 0 for two empty strings', () => {
        expect(levenshteinDistance('', '')).toBe(0)
    })

    it('returns 1 for single-character edit (substitution)', () => {
        expect(levenshteinDistance('cat', 'bat')).toBe(1)
    })

    it('returns 1 for single-character edit (insertion)', () => {
        expect(levenshteinDistance('cat', 'cats')).toBe(1)
    })

    it('returns 1 for single-character edit (deletion)', () => {
        expect(levenshteinDistance('cats', 'cat')).toBe(1)
    })

    it('returns correct distance for completely different strings', () => {
        expect(levenshteinDistance('abc', 'xyz')).toBe(3)
    })

    it('handles longer strings correctly', () => {
        expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
    })
})

// ── calculateSimilarity ─────────────────────────────────────────
describe('calculateSimilarity', () => {
    it('returns 1 for exact match (case-insensitive)', () => {
        expect(calculateSimilarity('Hello', 'hello')).toBe(1)
    })

    it('returns 0.8 when one string contains the other', () => {
        expect(calculateSimilarity('wooden chair', 'chair')).toBe(0.8)
        expect(calculateSimilarity('chair', 'wooden chair')).toBe(0.8)
    })

    it('returns value between 0 and 1 for partial similarity', () => {
        const sim = calculateSimilarity('table', 'cable')
        expect(sim).toBeGreaterThan(0)
        expect(sim).toBeLessThan(1)
    })

    it('returns low similarity for completely different strings', () => {
        const sim = calculateSimilarity('abc', 'xyz')
        expect(sim).toBeLessThan(0.5)
    })
})

// ── calculateRelevanceScore ─────────────────────────────────────
describe('calculateRelevanceScore', () => {
    it('returns 100 for exact name match', () => {
        const product = { name: 'Chair', description: null }
        expect(calculateRelevanceScore(product, 'chair')).toBe(100)
    })

    it('returns 80 when name starts with query', () => {
        const product = { name: 'Wooden Table Set', description: null }
        expect(calculateRelevanceScore(product, 'wooden')).toBe(80)
    })

    it('returns 60 when name contains query', () => {
        const product = { name: 'Modern Wooden Chair', description: null }
        expect(calculateRelevanceScore(product, 'wooden')).toBe(60)
    })

    it('adds 20 for description match', () => {
        const product = { name: 'Sofa', description: 'A comfortable wooden sofa' }
        // "wooden" not in name → fuzzy score, but IS in description → +20
        const score = calculateRelevanceScore(product, 'wooden')
        expect(score).toBeGreaterThanOrEqual(20)
    })

    it('handles null description gracefully', () => {
        const product = { name: 'Chair', description: null }
        expect(() => calculateRelevanceScore(product, 'test')).not.toThrow()
    })
})

// ── highlightMatch ──────────────────────────────────────────────
describe('highlightMatch', () => {
    it('wraps matching text in a <mark> tag', () => {
        const result = highlightMatch('Wooden Chair', 'wooden')
        expect(result).toContain('<mark')
        expect(result).toContain('Wooden')
    })

    it('is case-insensitive', () => {
        const result = highlightMatch('HELLO world', 'hello')
        expect(result).toContain('<mark')
    })

    it('returns original text when query is empty', () => {
        expect(highlightMatch('Chair', '')).toBe('Chair')
        expect(highlightMatch('Chair', '   ')).toBe('Chair')
    })

    it('escapes special regex characters in query', () => {
        expect(() => highlightMatch('price is $100', '$100')).not.toThrow()
    })
})

// ── getDidYouMeanSuggestion ─────────────────────────────────────
describe('getDidYouMeanSuggestion', () => {
    const terms = ['chair', 'table', 'sofa', 'bookshelf', 'wardrobe']

    it('returns a close match when similarity > 0.6', () => {
        // "chaire" is close to "chair" — similarity > 0.6
        expect(getDidYouMeanSuggestion('chaire', terms)).toBe('chair')
    })

    it('returns null for exact match (similarity = 1)', () => {
        expect(getDidYouMeanSuggestion('chair', terms)).toBeNull()
    })

    it('returns null when no term is similar enough', () => {
        expect(getDidYouMeanSuggestion('xyzabc', terms)).toBeNull()
    })

    it('returns the best match among multiple options', () => {
        // "tablr" similarity with "table" is > 0.6
        const result = getDidYouMeanSuggestion('tablr', terms)
        expect(result).toBe('table')
    })
})

// ── Search history (localStorage) ───────────────────────────────
// The source code guards with `typeof window === 'undefined'`;
// in Node/Jest `window` is not defined, so we must set it.
beforeAll(() => {
    // @ts-ignore — make window exist so the check passes
    globalThis.window = globalThis as any
})

describe('search history', () => {
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
    })

    it('saves a search and retrieves it', () => {
        saveSearchToHistory('wooden chair')
        const history = getSearchHistory()
        expect(history.length).toBe(1)
        expect(history[0].query).toBe('wooden chair')
    })

    it('deduplicates case-insensitively', () => {
        saveSearchToHistory('Chair')
        saveSearchToHistory('chair')
        const history = getSearchHistory()
        expect(history.length).toBe(1)
        expect(history[0].query).toBe('chair')
    })

    it('keeps newest item first', () => {
        saveSearchToHistory('first')
        saveSearchToHistory('second')
        const history = getSearchHistory()
        expect(history[0].query).toBe('second')
    })

    it('caps at MAX_HISTORY_ITEMS (10)', () => {
        for (let i = 0; i < 15; i++) {
            saveSearchToHistory(`query-${i}`)
        }
        const history = getSearchHistory()
        expect(history.length).toBe(10)
    })

    it('clearSearchHistory removes all entries', () => {
        saveSearchToHistory('test')
        clearSearchHistory()
        expect(getSearchHistory()).toEqual([])
    })

    it('ignores empty/whitespace queries', () => {
        saveSearchToHistory('')
        saveSearchToHistory('   ')
        expect(getSearchHistory()).toEqual([])
    })
})

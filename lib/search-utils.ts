export interface SearchHistoryItem {
    query: string
    timestamp: number
}

const SEARCH_HISTORY_KEY = 'krafted_search_history'
const MAX_HISTORY_ITEMS = 10

/**
 * Save search query to localStorage
 */
export function saveSearchToHistory(query: string): void {
    if (typeof window === 'undefined' || !query.trim()) return

    try {
        const history = getSearchHistory()
        const newItem: SearchHistoryItem = {
            query: query.trim(),
            timestamp: Date.now()
        }

        // Remove duplicates and add new item at the beginning
        const filtered = history.filter(item =>
            item.query.toLowerCase() !== newItem.query.toLowerCase()
        )
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)

        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
    } catch (error) {
        console.error('Failed to save search history:', error)
    }
}

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
        if (!stored) return []

        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('Failed to get search history:', error)
        return []
    }
}

/**
 * Clear all search history
 */
export function clearSearchHistory(): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
        console.error('Failed to clear search history:', error)
    }
}

/**
 * Simple Levenshtein distance for fuzzy matching
 */
export function levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length
    const len2 = str2.length
    const matrix: number[][] = []

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i]
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            )
        }
    }

    return matrix[len1][len2]
}

/**
 * Calculate similarity score (0-1) between two strings
 */
export function calculateSimilarity(str1: string, str2: string): number {
    const normalizedStr1 = str1.toLowerCase()
    const normalizedStr2 = str2.toLowerCase()

    // Exact match
    if (normalizedStr1 === normalizedStr2) return 1

    // Contains match
    if (normalizedStr1.includes(normalizedStr2) || normalizedStr2.includes(normalizedStr1)) {
        return 0.8
    }

    // Levenshtein-based similarity
    const distance = levenshteinDistance(normalizedStr1, normalizedStr2)
    const maxLength = Math.max(normalizedStr1.length, normalizedStr2.length)
    return 1 - (distance / maxLength)
}

/**
 * Highlight matching text in a string
 */
export function highlightMatch(text: string, query: string): string {
    if (!query.trim()) return text

    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
    return text.replace(regex, '<mark class="bg-amber-200 font-medium">$1</mark>')
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Calculate search relevance score for a product
 */
export function calculateRelevanceScore(
    product: { name: string; description?: string | null },
    query: string
): number {
    const normalizedQuery = query.toLowerCase()
    const normalizedName = product.name.toLowerCase()
    const normalizedDesc = (product.description || '').toLowerCase()

    let score = 0

    // Name exact match
    if (normalizedName === normalizedQuery) score += 100

    // Name starts with query
    else if (normalizedName.startsWith(normalizedQuery)) score += 80

    // Name contains query
    else if (normalizedName.includes(normalizedQuery)) score += 60

    // Name similarity
    else {
        const similarity = calculateSimilarity(normalizedName, normalizedQuery)
        score += similarity * 40
    }

    // Description contains query
    if (normalizedDesc.includes(normalizedQuery)) score += 20

    return score
}

/**
 * Get "Did you mean?" suggestion
 */
export function getDidYouMeanSuggestion(
    query: string,
    commonTerms: string[]
): string | null {
    const normalizedQuery = query.toLowerCase()
    let bestMatch: { term: string; similarity: number } | null = null

    for (const term of commonTerms) {
        const similarity = calculateSimilarity(normalizedQuery, term.toLowerCase())

        // Only suggest if similarity is high enough but not exact match
        if (similarity > 0.6 && similarity < 1) {
            if (!bestMatch || similarity > bestMatch.similarity) {
                bestMatch = { term, similarity }
            }
        }
    }

    return bestMatch ? bestMatch.term : null
}

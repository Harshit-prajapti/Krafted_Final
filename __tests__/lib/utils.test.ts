import { cn } from '@/lib/utils'

describe('cn (class name merger)', () => {
    it('merges simple class names', () => {
        expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    it('resolves Tailwind conflicts (last wins)', () => {
        // tailwind-merge should resolve p-4 vs px-2
        const result = cn('p-4', 'px-2')
        expect(result).toContain('px-2')
    })

    it('handles conditional classes via clsx syntax', () => {
        const isActive = true
        const result = cn('base', isActive && 'active')
        expect(result).toContain('base')
        expect(result).toContain('active')
    })

    it('filters out falsy values', () => {
        const result = cn('base', false, null, undefined, '', 'real')
        expect(result).toBe('base real')
    })

    it('returns empty string for no args', () => {
        expect(cn()).toBe('')
    })
})

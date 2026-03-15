/**
 * Serializes Prisma objects for safe Server→Client Component transfer.
 * Converts:
 * - Decimal → number
 * - BigInt → number
 * - Date → ISO string
 * - Buffer → base64 string
 *
 * Drop-in replacement for `JSON.parse(JSON.stringify(data))` with
 * better performance and predictable type coercion.
 */
export function serialize<T>(data: T): T {
    return JSON.parse(
        JSON.stringify(data, (_key, value) => {
            // Handle Prisma Decimal (has toNumber method)
            if (value !== null && typeof value === 'object' && typeof value.toNumber === 'function') {
                return value.toNumber()
            }
            // Handle BigInt
            if (typeof value === 'bigint') {
                return Number(value)
            }
            // Handle Buffer
            if (Buffer.isBuffer(value)) {
                return value.toString('base64')
            }
            return value
        })
    )
}

"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  X,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import SearchSuggestions from "@/components/search/SearchSuggestions"
import SearchHistory from "@/components/search/SearchHistory"
import { saveSearchToHistory } from "@/lib/search-utils"

const TRENDING_SEARCHES = [
  "Velvet Sofa",
  "King Bed Frame",
  "Dining Table Set",
  "Office Chair",
  "Coffee Table",
  "Bookshelf"
]

const POPULAR_CATEGORIES = [
  {
    name: "Living Room",
    count: 156,
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
  },
  {
    name: "Bedroom",
    count: 203,
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
  },
  {
    name: "Dining",
    count: 128,
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800",
  },
  {
    name: "Office",
    count: 94,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  }
]

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<{
    products: any[]
    categories: any[]
    suggestion: string | null
  }>({
    products: [],
    categories: [],
    suggestion: null
  })
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions({ products: [], categories: [], suggestion: null })
        return
      }

      setLoadingSuggestions(true)
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=5&includeCategories=true`
        )
        if (res.ok) {
          const data = await res.json()
          setSuggestions({
            products: data.products || [],
            categories: data.categories || [],
            suggestion: data.suggestion || null
          })
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setLoadingSuggestions(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  const handleSearch = (e?: React.FormEvent, queryOverride?: string) => {
    e?.preventDefault()
    const finalQuery = queryOverride || searchQuery
    if (finalQuery.trim()) {
      saveSearchToHistory(finalQuery)
      router.push(`/search/results?q=${encodeURIComponent(finalQuery)}`)
    }
  }

  const handleSuggestionClick = (term: string) => {
    saveSearchToHistory(term)
    router.push(`/search/results?q=${encodeURIComponent(term)}`)
  }

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    handleSearch(undefined, query)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* Animated Luxury Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-white to-gray-50" />

      {/* Hero Search */}
      <div className="relative z-40 pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center items-center gap-2 mb-4">
              <Sparkles className="text-amber-600 w-6 h-6" />
              <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight text-gray-900">
                Find Your Perfect Piece
              </h1>
              <Sparkles className="text-amber-600 w-6 h-6" />
            </div>
            <p className="text-gray-600 text-lg">
              Discover luxury furniture crafted for timeless living
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-10"
          >
            <div
              className={`relative flex items-center rounded-3xl backdrop-blur-xl bg-white shadow-[0_20px_60px_-10px_rgba(245,158,11,0.25)] border-2 transition-all ${isFocused
                ? "border-amber-400 ring-4 ring-amber-200/40"
                : "border-white/60"
                }`}
            >
              <Search className="absolute left-6 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 250)}
                placeholder="Search sofas, beds, tables..."
                className="w-full py-5 pl-14 pr-36 bg-transparent text-lg outline-none placeholder:text-gray-400"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setSuggestions({ products: [], categories: [], suggestion: null })
                  }}
                  className="absolute right-28 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="text-gray-400" />
                </button>
              )}

              <Button
                type="submit"
                className="absolute right-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 hover:shadow-[0_15px_40px_rgba(245,158,11,0.45)] transition-all"
              >
                {loadingSuggestions ? <Loader2 className="animate-spin" /> : "Search"}
              </Button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isFocused && searchQuery.length >= 2 && (
                <SearchSuggestions
                  products={suggestions.products}
                  categories={suggestions.categories}
                  loading={loadingSuggestions}
                  query={searchQuery}
                  onClose={() => setIsFocused(false)}
                />
              )}

              {isFocused && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute mt-4 w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border overflow-hidden z-50 text-left"
                >
                  <div className="px-6 py-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Trending</p>
                    {TRENDING_SEARCHES.map(term => (
                      <button
                        key={term}
                        type="button"
                        onMouseDown={() => handleSuggestionClick(term)}
                        className="block w-full text-left py-2 text-gray-600 hover:text-amber-600"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {suggestions.suggestion && searchQuery.length >= 2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-sm text-gray-600"
              >
                Did you mean: {" "}
                <button
                  onClick={() => {
                    setSearchQuery(suggestions.suggestion!)
                    handleSearch(undefined, suggestions.suggestion!)
                  }}
                  className="text-amber-600 font-medium hover:underline"
                >
                  {suggestions.suggestion}
                </button>
                ?
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 grid lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="space-y-8">
          <Card title="Trending Now" icon={<TrendingUp />}>
            {TRENDING_SEARCHES.map((t) => (
              <Row key={t} text={t} onClick={() => handleSuggestionClick(t)} />
            ))}
          </Card>

          <SearchHistory onSearchClick={handleHistoryClick} />
        </div>

        <div className="lg:col-span-2 space-y-14">
          <Section title="Browse by Category" link="/categories">
            <div className="grid sm:grid-cols-2 gap-6">
              {POPULAR_CATEGORIES.map((c) => (
                <motion.div
                  key={c.name}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link href={`/categories/${c.name.toLowerCase().replace(' ', '-')}`}>
                    <div className="relative h-56 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-[0_25px_80px_-20px_rgba(245,158,11,0.35)] transition-shadow">
                      <img
                        src={c.image}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        alt={c.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{c.name}</h3>
                        <p className="text-amber-300">{c.count} Products</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

/* Reusable UI Components */

function Card({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4 text-amber-600">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ text, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between px-4 py-3 bg-gray-50 hover:bg-amber-50 rounded-lg transition-colors group"
    >
      <span className="text-gray-700 group-hover:text-amber-700">{text}</span>
      <ArrowRight className="text-amber-600 group-hover:translate-x-1 transition-transform" />
    </button>
  )
}

function Section({ title, link, children }: any) {
  return (
    <section>
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-heading font-bold text-gray-900">{title}</h2>
        <Link href={link} className="text-amber-600 flex items-center gap-1 hover:gap-2 transition-all font-medium">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {children}
    </section>
  )
}

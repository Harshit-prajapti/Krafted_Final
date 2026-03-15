'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, Trash2 } from 'lucide-react'
import { getSearchHistory, clearSearchHistory, SearchHistoryItem } from '@/lib/search-utils'

interface SearchHistoryProps {
    onSearchClick: (query: string) => void
}

export default function SearchHistory({ onSearchClick }: SearchHistoryProps) {
    const [history, setHistory] = useState<SearchHistoryItem[]>([])

    useEffect(() => {
        setHistory(getSearchHistory())
    }, [])

    const handleClear = () => {
        clearSearchHistory()
        setHistory([])
    }

    const handleRemoveItem = (query: string) => {
        const updated = history.filter(item => item.query !== query)
        localStorage.setItem('krafted_search_history', JSON.stringify(updated))
        setHistory(updated)
    }

    if (history.length === 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-semibold">Recent Searches</h3>
                </div>
                <button
                    onClick={handleClear}
                    className="text-sm text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                    aria-label="Clear history"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear
                </button>
            </div>

            <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                    {history.slice(0, 5).map((item, index) => (
                        <motion.button
                            key={`${item.query}-${item.timestamp}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSearchClick(item.query)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-amber-50 rounded-lg transition-colors group"
                        >
                            <span className="text-gray-700 group-hover:text-amber-700 font-medium">
                                {item.query}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveItem(item.query)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-amber-100 rounded-full transition-all"
                                aria-label={`Remove ${item.query} from history`}
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </motion.button>
                    ))}
                </div>
            </AnimatePresence>
        </motion.div>
    )
}

"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

interface Language {
    code: string
    name: string
    flag: string
}

const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

interface LanguageSwitcherProps {
    variant?: 'desktop' | 'mobile'
    className?: string
}

// Portal-based dropdown to avoid z-index issues
function DropdownPortal({
    isOpen,
    triggerRef,
    onClose,
    children
}: {
    isOpen: boolean
    triggerRef: React.RefObject<HTMLButtonElement | null>
    onClose: () => void
    children: React.ReactNode
}) {
    const [position, setPosition] = useState({ top: 0, left: 0, width: 160 })
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setPosition({
                top: rect.bottom + 8,
                left: rect.right - 160, // Align right edge to trigger right edge
                width: 160
            })
        }
    }, [isOpen, triggerRef])

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }

        // Close on escape
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose, triggerRef])

    if (!mounted || !isOpen) return null

    return createPortal(
        <div
            ref={dropdownRef}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 99999,
            }}
            className="bg-[#1a1a1a] border border-amber-500/30 rounded-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
        >
            {children}
        </div>,
        document.body
    )
}

export default function LanguageSwitcher({ variant = 'desktop', className }: LanguageSwitcherProps) {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [currentLang, setCurrentLang] = useState('en')

    // Sync with i18n language
    useEffect(() => {
        setCurrentLang(i18n.language?.substring(0, 2) || 'en')
    }, [i18n.language])

    const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0]

    const handleLanguageChange = useCallback(async (langCode: string) => {
        try {
            await i18n.changeLanguage(langCode)
            setCurrentLang(langCode)
            setIsOpen(false)
            // Store preference in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('i18nextLng', langCode)
            }
        } catch (error) {
            console.error('Failed to change language:', error)
        }
    }, [i18n])

    const handleClose = useCallback(() => {
        setIsOpen(false)
    }, [])

    if (variant === 'mobile') {
        return (
            <div className={cn("w-full", className)}>
                <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Language
                </p>
                <div className="flex gap-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg border-2 transition-all duration-200",
                                currentLanguage.code === lang.code
                                    ? "border-amber-500 bg-amber-50 text-amber-700"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50/50"
                            )}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm font-medium hidden sm:inline">{lang.name}</span>
                            <span className="text-sm font-medium sm:hidden">{lang.code.toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    // Desktop variant with portal-based dropdown
    return (
        <div className={cn("relative", className)}>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-amber-400/80 hover:text-amber-300 transition-all group cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <Globe size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <span className="text-sm font-medium bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                    {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
                </span>
                <ChevronDown
                    size={14}
                    className={cn(
                        "text-amber-400/80 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <DropdownPortal
                isOpen={isOpen}
                triggerRef={triggerRef}
                onClose={handleClose}
            >
                <div className="py-1" role="listbox">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            role="option"
                            aria-selected={currentLanguage.code === lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-left transition-all cursor-pointer",
                                currentLanguage.code === lang.code
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-300"
                            )}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm font-medium flex-1">{lang.name}</span>
                            {currentLanguage.code === lang.code && (
                                <Check size={16} className="text-amber-400" />
                            )}
                        </button>
                    ))}
                </div>
            </DropdownPortal>
        </div>
    )
}

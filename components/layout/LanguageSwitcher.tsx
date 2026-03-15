'use client'

import { useTranslation } from 'react-i18next'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, Check } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
]

interface LanguageSwitcherProps {
    className?: string
    variant?: 'default' | 'mobile'
}

export default function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
    const { i18n } = useTranslation()
    const router = useRouter()
    const pathname = usePathname()

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode)
        // Optionally persist to cookie or local storage if not handled by i18next plugin
        // The middleware or next-i18next config usually handles the routing or cookie

        // If using next-i18next with subpaths, we might need to push to the new path
        // router.push(pathname, pathname, { locale: langCode })
    }

    if (variant === 'mobile') {
        return (
            <div className={cn("flex flex-col gap-2", className)}>
                <p className="text-sm font-medium text-gray-500 px-2">Language</p>
                <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                        <Button
                            key={lang.code}
                            variant={i18n.language === lang.code ? "default" : "outline"}
                            size="sm"
                            className={cn(
                                "flex-1 justify-start gap-2",
                                i18n.language === lang.code ? "bg-black text-white" : "border-gray-200"
                            )}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <span className="text-base">{lang.flag}</span>
                            {lang.label}
                        </Button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("w-9 h-9 rounded-full hover:bg-gray-100 transition-colors", className)}
                >
                    <Globe className="h-4 w-4 text-gray-700" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px] bg-white border-gray-100 shadow-xl rounded-xl p-1">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={(e) => {
                            e.preventDefault()
                            handleLanguageChange(lang.code)
                        }}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg text-sm transition-colors",
                            i18n.language === lang.code ? "bg-gray-50 font-medium text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black"
                        )}
                    >
                        <span className="text-base">{lang.flag}</span>
                        <span className="flex-1">{lang.label}</span>
                        {i18n.language === lang.code && <Check className="h-3 w-3 text-black" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

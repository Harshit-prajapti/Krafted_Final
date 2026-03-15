'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    fill?: boolean
    className?: string
    containerClassName?: string
    priority?: boolean
    quality?: number
    sizes?: string
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    fallback?: string
}

export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    fill = false,
    className,
    containerClassName,
    priority = false,
    quality = 85,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    objectFit = 'cover',
    fallback = '/placeholder.png'
}: OptimizedImageProps) {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const imageSrc = error ? fallback : src

    const isExternalUrl = src.startsWith('http://') || src.startsWith('https://')

    if (isExternalUrl) {
        return (
            <div className={cn('relative overflow-hidden', containerClassName)}>
                {loading && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                )}
                <img
                    src={imageSrc}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setError(true)
                        setLoading(false)
                    }}
                    className={cn(
                        'transition-opacity duration-300',
                        loading ? 'opacity-0' : 'opacity-100',
                        className
                    )}
                    style={{
                        objectFit,
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                    }}
                />
            </div>
        )
    }

    return (
        <div className={cn('relative overflow-hidden', containerClassName)}>
            {loading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                </div>
            )}
            <Image
                src={imageSrc}
                alt={alt}
                width={fill ? undefined : (width || 400)}
                height={fill ? undefined : (height || 400)}
                fill={fill}
                priority={priority}
                quality={quality}
                sizes={sizes}
                onLoad={() => setLoading(false)}
                onError={() => {
                    setError(true)
                    setLoading(false)
                }}
                className={cn(
                    'transition-opacity duration-300',
                    loading ? 'opacity-0' : 'opacity-100',
                    className
                )}
                style={{ objectFit }}
            />
        </div>
    )
}

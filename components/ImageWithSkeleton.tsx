'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  style?: React.CSSProperties
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  style,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`image-skeleton-wrapper ${className}`} style={{ position: 'relative', ...style }}>
      {isLoading && (
        <div
          className="image-skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#f0f0f0',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          style={{
            objectFit: 'cover',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            ...style,
          }}
        />
      )}
    </div>
  )
}

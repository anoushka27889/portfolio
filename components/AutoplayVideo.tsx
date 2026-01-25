'use client'

import { useRef, useEffect, useState } from 'react'

interface AutoplayVideoProps {
  src: string
  poster?: string
  className?: string
}

export default function AutoplayVideo({ src, poster, className = '' }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Intersection Observer to play video only when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)

        if (entry.isIntersecting) {
          video.play().catch(error => {
            console.log('Autoplay prevented:', error)
          })
        } else {
          video.pause()
        }
      },
      {
        threshold: 0.25, // Play when 25% visible
        rootMargin: '50px'
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  )
}

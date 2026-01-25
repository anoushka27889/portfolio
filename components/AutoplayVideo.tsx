'use client'

import { useRef, useEffect, useState } from 'react'

interface AutoplayVideoProps {
  src: string
  poster?: string
  className?: string
  hasAudio?: boolean // If true, video requires user interaction to play (shows controls)
}

export default function AutoplayVideo({ src, poster, className = '', hasAudio = false }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // If video has audio, don't auto-play (requires user interaction)
    if (hasAudio) return

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
  }, [hasAudio])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay={!hasAudio}
      loop
      muted={!hasAudio}
      playsInline
      controls={hasAudio}
    />
  )
}

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
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // For audio videos, observe the container; for others, observe the video
    const elementToObserve = hasAudio && containerRef.current ? containerRef.current : video

    // Intersection Observer to play/pause video based on visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)

        if (entry.isIntersecting) {
          // Auto-play only if no audio
          if (!hasAudio) {
            video.play().catch(() => {
              // Autoplay was prevented
            })
          }
        } else {
          // Always pause when out of view (both audio and non-audio videos)
          video.pause()
          if (hasAudio) {
            setIsPlaying(false)
            setShowControls(true)
            // Clear any pending hide timers
            if (hideControlsTimeoutRef.current) {
              clearTimeout(hideControlsTimeoutRef.current)
            }
          }
        }
      },
      {
        threshold: 0.25, // Play when 25% visible
        rootMargin: '50px'
      }
    )

    observer.observe(elementToObserve)

    return () => {
      // Pause video and release resources on cleanup
      video.pause()
      // Set src to empty string to release video memory
      video.src = ''
      // Remove source elements if any
      while (video.firstChild) {
        video.removeChild(video.firstChild)
      }
      video.load()
      observer.disconnect()
    }
  }, [hasAudio])

  // Handle play/pause toggle for audio videos
  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
      // Hide controls after playing - pass true to indicate it's playing
      startHideControlsTimer(true)
    } else {
      video.pause()
      setIsPlaying(false)
      setShowControls(true)
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }

  const startHideControlsTimer = (willBePlaying?: boolean) => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
    const shouldHide = willBePlaying !== undefined ? willBePlaying : isPlaying
    if (shouldHide) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 1000)
    }
  }

  const handleMouseMove = () => {
    if (!hasAudio) return
    setShowControls(true)
    if (isPlaying) {
      startHideControlsTimer()
    }
  }

  const handleMouseLeave = () => {
    if (!hasAudio) return
    if (isPlaying) {
      startHideControlsTimer()
    }
  }

  // Cleanup all timeouts and resources on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
        hideControlsTimeoutRef.current = null
      }
    }
  }, [])

  // Update isPlaying state based on video events
  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasAudio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [hasAudio])

  if (hasAudio) {
    return (
      <div
        ref={containerRef}
        className="video-container-with-controls"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={togglePlayPause}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className={className}
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            togglePlayPause()
          }}
          className="custom-video-play-button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-green)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'opacity 0.3s ease-out, transform 0.2s ease',
            zIndex: 10,
            opacity: showControls ? 1 : 0,
            pointerEvents: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
          }}
        >
          {isPlaying ? (
            // Pause icon (bigger)
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            // Play icon (bigger, centered properly)
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>
    )
  }

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
    />
  )
}

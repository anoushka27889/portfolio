'use client'

import { useState, useEffect, useRef } from 'react'

interface ImageGalleryProps {
  images: string[]
  arrowColors?: ('white' | '#767676')[] // Optional - defaults to white for all slides
  slideshowIndex: number
}

// Helper function to check if URL is a Vimeo embed
const isVimeoUrl = (url: string) => {
  return url.includes('vimeo.com') || url.includes('player.vimeo.com')
}

// Helper function to check if file is a video (MP4)
const isVideoFile = (url: string) => {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')
}

// Helper function to check if file is an animated GIF
const isAnimatedGif = (url: string) => {
  return url.endsWith('.gif')
}

// Helper function to derive poster path from video src
function getVideoPoster(videoSrc: string): string | undefined {
  // Auto-generate poster path: video.mp4 → video-poster.jpg
  if (videoSrc.endsWith('.mp4') || videoSrc.endsWith('.webm') || videoSrc.endsWith('.mov')) {
    const extension = videoSrc.match(/\.(mp4|webm|mov)$/)?.[0] || ''
    return videoSrc.replace(extension, '-poster.jpg')
  }
  return undefined
}

export default function ImageGallery({ images, arrowColors, slideshowIndex }: ImageGalleryProps) {
  // Default to white arrows for all slides if arrowColors not provided
  const defaultArrowColors = arrowColors || images.map(() => 'white' as const)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [arrowColor, setArrowColor] = useState(defaultArrowColors[0] || 'white')
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [preloadingImages, setPreloadingImages] = useState<Set<number>>(new Set())
  const [loadErrors, setLoadErrors] = useState<Map<number, string>>(new Map())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Log slideshow initialization
  useEffect(() => {
    console.log(`[ImageGallery #${slideshowIndex}] Initialized with ${images.length} images:`, images)
  }, [])


  // Helper function to reset the autoplay timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (images.length > 1 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 5000)
    }
  }

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (images.length <= 1 || isPaused) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [images.length, isPaused])


  const changeSlide = (direction: number) => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + direction
      if (newIndex >= images.length) {
        newIndex = 0
      } else if (newIndex < 0) {
        newIndex = images.length - 1
      }
      return newIndex
    })
    // Reset timer after manual navigation
    resetTimer()
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    changeSlide(-1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    changeSlide(1)
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // Update arrow color based on current slide (using pre-computed values)
  useEffect(() => {
    const newColor = defaultArrowColors[currentIndex] || 'white'
    console.log(`[ImageGallery #${slideshowIndex}] Slide ${currentIndex}: arrow color = ${newColor}`)
    setArrowColor(newColor)
  }, [currentIndex, defaultArrowColors, slideshowIndex])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div
      className="project-slideshow"
      data-slideshow={slideshowIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slideshow-images">
        {images.map((image, index) => {
          return (
            <div
              key={index}
              className={`slideshow-image ${index === currentIndex ? 'active' : ''}`}
            >
              {isVimeoUrl(image) ? (
                <div className="vimeo-container">
                  <iframe
                    src={image}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={`Video ${index + 1}`}
                  />
                </div>
              ) : isVideoFile(image) ? (
                <video
                  key={image}
                  src={image}
                  poster={getVideoPoster(image)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onLoad={() => {
                    setLoadedImages(prev => new Set(prev).add(index))
                  }}
                  onError={(e) => {
                    console.error(`[ImageGallery #${slideshowIndex}] Image ${index} failed to load`, {
                      src: image,
                      error: e
                    })
                    setLoadErrors(prev => new Map(prev).set(index, 'Failed to load'))
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="slideshow-nav prev"
            onClick={handlePrev}
            aria-label="Previous image"
            style={{ color: arrowColor }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="slideshow-nav next"
            onClick={handleNext}
            aria-label="Next image"
            style={{ color: arrowColor }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'

interface ImageGalleryProps {
  images: string[]
  arrowColors: ('white' | '#767676')[]
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [arrowColor, setArrowColor] = useState(arrowColors[0] || 'white')
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [preloadingImages, setPreloadingImages] = useState<Set<number>>(new Set())
  const [loadErrors, setLoadErrors] = useState<Map<number, string>>(new Map())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const loadStartTimes = useRef<Map<number, number>>(new Map())
  const loadTimeoutRefs = useRef<Map<number, NodeJS.Timeout>>(new Map())

  // Log slideshow initialization
  useEffect(() => {
    console.log(`[ImageGallery #${slideshowIndex}] Initialized with ${images.length} images:`, images)
    images.forEach((img, idx) => {
      if (!isVideoFile(img) && !isVimeoUrl(img)) {
        loadStartTimes.current.set(idx, Date.now())

        // Set a 10-second timeout for stuck images
        const timeout = setTimeout(() => {
          if (!loadedImages.has(idx) && !loadErrors.has(idx)) {
            console.error(`[ImageGallery #${slideshowIndex}] Image ${idx} timeout after 10s - forcing error state`, {
              src: img,
              loadedSoFar: loadedImages.size
            })
            setLoadErrors(prev => new Map(prev).set(idx, 'Timeout after 10s'))
          }
        }, 10000)

        loadTimeoutRefs.current.set(idx, timeout)
      }
    })

    return () => {
      // Clear all timeouts on unmount
      loadTimeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      loadTimeoutRefs.current.clear()
    }
  }, [])

  // Log loading status periodically
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const totalImages = images.filter(img => !isVideoFile(img) && !isVimeoUrl(img)).length
      const loadedCount = loadedImages.size
      const errorCount = loadErrors.size

      if (loadedCount < totalImages) {
        console.log(`[ImageGallery #${slideshowIndex}] Loading status:`, {
          loaded: loadedCount,
          total: totalImages,
          errors: errorCount,
          pendingImages: images.filter((_, idx) => !loadedImages.has(idx) && !loadErrors.has(idx) && !isVideoFile(images[idx]) && !isVimeoUrl(images[idx]))
        })
      }
    }, 2000)

    return () => clearInterval(statusInterval)
  }, [loadedImages, loadErrors, images, slideshowIndex])

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
    setArrowColor(arrowColors[currentIndex] || 'white')
  }, [currentIndex, arrowColors])

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
          // Only render current slide and adjacent slides for better performance
          const shouldRender = Math.abs(index - currentIndex) <= 1
          if (!shouldRender) {
            return null
          }

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
                    const loadTime = Date.now() - (loadStartTimes.current.get(index) || Date.now())
                    console.log(`[ImageGallery #${slideshowIndex}] Image ${index} loaded successfully in ${loadTime}ms`, {
                      src: image
                    })
                    setLoadedImages(prev => new Set(prev).add(index))
                    loadStartTimes.current.delete(index)

                    // Clear timeout on successful load
                    const timeout = loadTimeoutRefs.current.get(index)
                    if (timeout) {
                      clearTimeout(timeout)
                      loadTimeoutRefs.current.delete(index)
                    }
                  }}
                  onError={(e) => {
                    const loadTime = Date.now() - (loadStartTimes.current.get(index) || Date.now())
                    const error = `Failed to load after ${loadTime}ms`
                    console.error(`[ImageGallery #${slideshowIndex}] Image ${index} failed to load`, {
                      src: image,
                      error: e,
                      loadTime
                    })
                    setLoadErrors(prev => new Map(prev).set(index, error))
                    loadStartTimes.current.delete(index)

                    // Clear timeout on error
                    const timeout = loadTimeoutRefs.current.get(index)
                    if (timeout) {
                      clearTimeout(timeout)
                      loadTimeoutRefs.current.delete(index)
                    }
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

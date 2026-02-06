'use client'

import { useState, useEffect, useRef } from 'react'

interface ImageGalleryProps {
  images: string[]
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

export default function ImageGallery({ images, slideshowIndex }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [arrowColor, setArrowColor] = useState('white')
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [preloadingImages, setPreloadingImages] = useState<Set<number>>(new Set())
  const [loadErrors, setLoadErrors] = useState<Map<number, string>>(new Map())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null)
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

  // Auto-advance every 5 seconds - resets when slide changes
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
  }, [images.length, isPaused, currentIndex])


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

  // Analyze image brightness to determine arrow color
  useEffect(() => {
    const analyzeImageBrightness = async () => {
      const currentImage = images[currentIndex]

      if (!currentImage || isVimeoUrl(currentImage)) {
        setArrowColor('white')
        return
      }

      // Try using the actual img element from the DOM
      const slideshow = document.querySelector(`[data-slideshow="${slideshowIndex}"]`)
      const activeSlide = slideshow?.querySelector(`.slideshow-image.active img`) as HTMLImageElement

      if (!activeSlide) {
        setArrowColor('white')
        return
      }

      if (!activeSlide.complete || activeSlide.naturalWidth === 0) {
        setArrowColor('white')
        return
      }

      // Reuse canvas instance to prevent memory leaks
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas')
      }
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        setArrowColor('white')
        return
      }

      try {
        // Sample only the small areas where the arrow buttons actually are
        // Arrows are positioned at left: 0.1rem and right: 0.1rem, vertically centered
        // Let's sample 80px x 80px regions (arrow tap target size) at the vertical center

        const imgWidth = activeSlide.naturalWidth
        const imgHeight = activeSlide.naturalHeight

        // Sample size in image coordinates (approximately 80px in screen space)
        const sampleSize = Math.min(80, Math.floor(imgWidth * 0.05))

        if (sampleSize === 0) {
          setArrowColor('white')
          return
        }

        // Sample from left edge and right edge, vertically centered
        const verticalCenter = Math.floor(imgHeight / 2) - Math.floor(sampleSize / 2)

        canvas.width = sampleSize * 2
        canvas.height = sampleSize

        // Draw left arrow area (from left edge)
        ctx.drawImage(activeSlide, 0, verticalCenter, sampleSize, sampleSize, 0, 0, sampleSize, sampleSize)
        // Draw right arrow area (from right edge)
        ctx.drawImage(activeSlide, imgWidth - sampleSize, verticalCenter, sampleSize, sampleSize, sampleSize, 0, sampleSize, sampleSize)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        let totalBrightness = 0
        const pixelCount = data.length / 4

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          // Calculate perceived brightness
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114)
          totalBrightness += brightness
        }

        const avgBrightness = totalBrightness / pixelCount

        // Use light charcoal only when background is very light (brightness > 200)
        // #767676 is the lightest gray that maintains WCAG AA contrast (4.5:1) on white
        // This ensures white is the default and light charcoal is only used when
        // white arrows would fail a11y contrast requirements
        const chosenColor = avgBrightness > 200 ? '#767676' : 'white'

        setArrowColor(chosenColor)
      } catch (e) {
        // On error, default to white arrows
        setArrowColor('white')
      } finally {
        // Clear canvas after use but keep the canvas instance
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    // Clear any pending analysis
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    // Small delay to ensure image is rendered
    analysisTimeoutRef.current = setTimeout(analyzeImageBrightness, 300)

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }
    }
  }, [currentIndex, images, slideshowIndex])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up canvas on component unmount
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
        canvasRef.current.width = 0
        canvasRef.current.height = 0
        canvasRef.current = null
      }
      // Clean up interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // Clean up timeout
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
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

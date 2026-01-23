'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  slideshowIndex: number
}

export default function ImageGallery({ images, slideshowIndex }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  return (
    <div
      className="project-slideshow"
      data-slideshow={slideshowIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slideshow-images">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slideshow-image ${index === currentIndex ? 'active' : ''}`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="slideshow-nav prev"
            onClick={handlePrev}
            aria-label="Previous image"
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

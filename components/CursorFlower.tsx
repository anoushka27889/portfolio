'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const FLOWER_CLOSE = '/media/projects/homepage/flower-close.png'
const FLOWER_BLOOM = '/media/projects/homepage/flower-bloom.png'

export default function CursorFlower() {
  const pathname = usePathname()
  const isHomepage = pathname === '/' || pathname === '/index'
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isBloom, setIsBloom] = useState(false)
  const preloadedImagesRef = useRef<HTMLImageElement[]>([])

  // Preload images with proper cleanup
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new window.Image()
      img.src = src
      preloadedImagesRef.current.push(img)
      return img
    }
    preloadImage(FLOWER_CLOSE)
    preloadImage(FLOWER_BLOOM)

    return () => {
      // Clean up preloaded images
      preloadedImagesRef.current.forEach(img => {
        img.src = ''
      })
      preloadedImagesRef.current = []
    }
  }, [])

  // Memoize the clickable check to avoid recreating on every render
  const checkIfOverClickable = useCallback((target: HTMLElement) => {
    return !!(
      target.closest('.project-content-link') ||
      target.closest('.slideshow-link') ||
      target.closest('.project-arrow') ||
      target.closest('[data-project-url]') ||
      target.closest('.video-container-with-controls') ||
      target.closest('.custom-video-play-button')
    )
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsBloom(checkIfOverClickable(e.target as HTMLElement))
    }

    const handleMouseOver = (e: Event) => {
      setIsBloom(checkIfOverClickable(e.target as HTMLElement))
    }

    const handleMouseOut = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const relatedTarget = mouseEvent.relatedTarget as HTMLElement
      if (!relatedTarget || !checkIfOverClickable(relatedTarget)) {
        setIsBloom(false)
      }
    }

    // Show cursor in work container
    const workContainer = document.querySelector('.work-container')
    if (workContainer) {
      const handleEnter = () => setIsVisible(true)
      const handleLeave = () => {
        setIsVisible(false)
        setIsBloom(false)
      }

      workContainer.addEventListener('mouseenter', handleEnter)
      workContainer.addEventListener('mouseleave', handleLeave)
      workContainer.addEventListener('mouseover', handleMouseOver)
      workContainer.addEventListener('mouseout', handleMouseOut)

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        workContainer.removeEventListener('mouseenter', handleEnter)
        workContainer.removeEventListener('mouseleave', handleLeave)
        workContainer.removeEventListener('mouseover', handleMouseOver)
        workContainer.removeEventListener('mouseout', handleMouseOut)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [checkIfOverClickable])

  // Only render on homepage
  if (!isHomepage) {
    return null
  }

  return (
    <>
      <div
        className="cursor-image"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible && !isBloom ? 1 : 0,
        }}
      >
        <Image
          src={FLOWER_CLOSE}
          alt="Cursor"
          width={40}
          height={40}
          priority
        />
      </div>
      <div
        className="cursor-image"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible && isBloom ? 1 : 0,
        }}
      >
        <Image
          src={FLOWER_BLOOM}
          alt="Cursor"
          width={40}
          height={40}
          priority
        />
      </div>
    </>
  )
}

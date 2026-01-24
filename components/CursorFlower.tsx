'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const FLOWER_CLOSE = 'https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/t/67a2eb767891303f50ded901/1738730370844/flower-close.png'
const FLOWER_BLOOM = 'https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/t/67a2eb7ce4b8cd4d3d069079/1738730379167/flower-bloom.png'

export default function CursorFlower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isBloom, setIsBloom] = useState(false)

  // Preload images
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new window.Image()
      img.src = src
    }
    preloadImage(FLOWER_CLOSE)
    preloadImage(FLOWER_BLOOM)
  }, [])

  useEffect(() => {
    const checkIfOverClickable = (target: HTMLElement) => {
      return !!(
        target.closest('.project-content-link') ||
        target.closest('.slideshow-link') ||
        target.closest('.project-arrow') ||
        target.closest('[data-project-url]')
      )
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsBloom(checkIfOverClickable(e.target as HTMLElement))
    }

    const handleMouseOver = (e: MouseEvent) => {
      setIsBloom(checkIfOverClickable(e.target as HTMLElement))
    }

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement
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
  }, [])

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
          unoptimized
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
          unoptimized
          priority
        />
      </div>
    </>
  )
}

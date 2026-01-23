'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function CursorFlower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isBloom, setIsBloom] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    // Show cursor in work container
    const workContainer = document.querySelector('.work-container')
    if (workContainer) {
      const handleEnter = () => setIsVisible(true)
      const handleLeave = () => setIsVisible(false)

      workContainer.addEventListener('mouseenter', handleEnter)
      workContainer.addEventListener('mouseleave', handleLeave)

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        workContainer.removeEventListener('mouseenter', handleEnter)
        workContainer.removeEventListener('mouseleave', handleLeave)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  useEffect(() => {
    // Bloom on clickable elements
    const handleMouseEnter = () => setIsBloom(true)
    const handleMouseLeave = () => setIsBloom(false)

    const clickableElements = document.querySelectorAll(
      '.project-item[data-project-url], .project-content-link, .slideshow-link, .project-arrow'
    )

    clickableElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      clickableElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <div
        className="cursor-image"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <Image
          src={
            isBloom
              ? 'https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/t/67a2eb7ce4b8cd4d3d069079/1738730379167/flower-bloom.png'
              : 'https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/t/67a2eb767891303f50ded901/1738730370844/flower-close.png'
          }
          alt="Cursor"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </>
  )
}

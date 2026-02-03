'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { bio } from '@/lib/content-data'

export default function Bio() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Preload bird image
  useEffect(() => {
    const img = new window.Image()
    img.src = bio.hoverImage
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const bioText = document.querySelector('.bio-text')
    if (bioText) {
      const handleEnter = () => setIsHovering(true)
      const handleLeave = () => setIsHovering(false)

      bioText.addEventListener('mouseenter', handleEnter as EventListener)
      bioText.addEventListener('mouseleave', handleLeave as EventListener)
      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        bioText.removeEventListener('mouseenter', handleEnter as EventListener)
        bioText.removeEventListener('mouseleave', handleLeave as EventListener)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <>
      <div className="bio-container">
        <p className="bio-text">
          {bio.text}
        </p>
      </div>

      <div
        className="bio-hover-image"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isHovering ? 1 : 0,
        }}
      >
        <Image
          src={bio.hoverImage}
          alt=""
          width={60}
          height={60}
          priority
        />
      </div>
    </>
  )
}

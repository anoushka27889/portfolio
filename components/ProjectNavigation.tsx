'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface ProjectNavigationProps {
  prevProject: {
    href: string
    name: string
  }
  nextProject: {
    href: string
    name: string
  }
}

const ARROW_LEFT_DEFAULT = '/media/projects/homepage/Untitled_Artwork_8.png'
const ARROW_RIGHT_DEFAULT = '/media/projects/homepage/Untitled_Artwork_10.png'

export default function ProjectNavigation({ prevProject, nextProject }: ProjectNavigationProps) {
  const router = useRouter()
  const [hoveredArrow, setHoveredArrow] = useState<'left' | 'right' | null>(null)
  // Always start with true to match server render, then update on client
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Preload arrow images
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new window.Image()
      img.src = src
    }
    preloadImage(ARROW_LEFT_DEFAULT)
    preloadImage(ARROW_RIGHT_DEFAULT)
  }, [])

  // Scroll detection to show/hide navigation (synced with Header)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let lastScrollY = window.scrollY
    let scrollThreshold = 50 // Only hide after scrolling 50px

    const handleScroll = () => {
      // Don't hide during page transitions
      if (document.body.classList.contains('transitioning')) {
        return
      }

      const currentScrollY = window.scrollY
      const scrollDelta = Math.abs(currentScrollY - lastScrollY)

      // Only hide navigation if user has scrolled past threshold
      if (!isScrolling && scrollDelta > scrollThreshold) {
        setIsVisible(false)
        setIsScrolling(true)
      }

      // Clear the timeout
      clearTimeout(scrollTimeout)

      // Set timeout to detect when scrolling stops
      // 800ms delay (synced with header) before showing navigation again
      scrollTimeout = setTimeout(() => {
        // Show navigation when scrolling stops
        setIsVisible(true)
        setIsScrolling(false)
        lastScrollY = currentScrollY
      }, 800)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isScrolling])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on project detail pages, not if user is typing
      if ((e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        router.push(prevProject.href)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        router.push(nextProject.href)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [prevProject.href, nextProject.href, router])

  // Prefetch adjacent pages
  useEffect(() => {
    router.prefetch(prevProject.href)
    router.prefetch(nextProject.href)
  }, [prevProject.href, nextProject.href, router])

  return (
    <div
      className="project-navigation"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <Link
        href={prevProject.href}
        className="nav-link prev"
        aria-label={`Previous project: ${prevProject.name}`}
        onMouseEnter={() => setHoveredArrow('left')}
        onMouseLeave={() => setHoveredArrow(null)}
      >
        <div className="arrow-left" aria-hidden="true">
          <Image
            src={ARROW_LEFT_DEFAULT}
            alt=""
            width={60}
            height={60}
            priority
          />
        </div>
        <span className="nav-project-name">{prevProject.name}</span>
      </Link>
      <Link
        href={nextProject.href}
        className="nav-link next"
        aria-label={`Next project: ${nextProject.name}`}
        onMouseEnter={() => setHoveredArrow('right')}
        onMouseLeave={() => setHoveredArrow(null)}
      >
        <div className="arrow-right" aria-hidden="true">
          <Image
            src={ARROW_RIGHT_DEFAULT}
            alt=""
            width={60}
            height={60}
            priority
          />
        </div>
        <span className="nav-project-name">{nextProject.name}</span>
      </Link>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function PageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isAboutPage = pathname?.includes('/about')

  useEffect(() => {
    // Mark body as loaded
    document.body.classList.add('loaded')

    // Update page styles based on route
    const updatePageStyles = () => {
      const isAbout = pathname?.includes('/about')
      document.body.classList.toggle('about-page', isAbout)
    }

    updatePageStyles()

    // Reset transitioning state when pathname changes
    setIsTransitioning(false)
    document.body.classList.remove('transitioning')
  }, [pathname])

  useEffect(() => {
    // Handle link clicks for transitions
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')

      if (
        !link ||
        !link.href ||
        link.target === '_blank' ||
        link.href.indexOf(window.location.origin) === -1 ||
        link.href.indexOf('#') !== -1 ||
        link.href.indexOf('tel:') !== -1 ||
        link.href.indexOf('mailto:') !== -1
      ) {
        return
      }

      // Don't transition if same page
      if (link.href === window.location.href) {
        return
      }

      e.preventDefault()

      const targetPath = new URL(link.href).pathname
      const targetIsAbout = targetPath.includes('/about')
      const overlay = document.getElementById('page-transition')
      if (overlay) {
        overlay.style.background = targetIsAbout ? 'black' : 'white'
      }

      document.body.classList.add('transitioning')
      setIsTransitioning(true)

      setTimeout(() => {
        router.push(targetPath)
      }, 300)
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [router])

  return (
    <div
      id="page-transition"
      className="page-transition"
      style={{
        background: isAboutPage ? 'black' : 'white',
        opacity: isTransitioning ? 1 : 0,
      }}
    />
  )
}

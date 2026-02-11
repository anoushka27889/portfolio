'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function PageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Mark body as loaded
    document.body.classList.add('loaded')

    // Reset transitioning state when pathname changes
    // Add a small delay to allow the page to render first
    const timer = setTimeout(() => {
      setIsTransitioning(false)
      document.body.classList.remove('transitioning')
    }, 50)

    return () => clearTimeout(timer)
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
        background: 'white',
        opacity: isTransitioning ? 1 : 0,
      }}
    />
  )
}

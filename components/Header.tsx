'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SUN_IMAGE = 'https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/t/67a0071fe38c0351dbabe63c/1738540855684/sun_animated.png'
const MOON_IMAGE = 'https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/t/67a011e09bc44212241ef87a/1738543608306/moon_animated.png'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const pathname = usePathname()
  const isAboutPage = pathname?.includes('/about')

  // Preload both sun and moon images
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new window.Image()
      img.src = src
    }
    preloadImage(SUN_IMAGE)
    preloadImage(MOON_IMAGE)
  }, [])

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      // Hide header when scrolling
      if (!isScrolling) {
        setIsVisible(false)
        setIsScrolling(true)
      }

      // Clear the timeout
      clearTimeout(scrollTimeout)

      // Set timeout to detect when scrolling stops
      scrollTimeout = setTimeout(() => {
        // Show header when scrolling stops
        setIsVisible(true)
        setIsScrolling(false)
      }, 150) // 150ms after scrolling stops
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isScrolling])

  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/' || pathname === '/index') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.location.href = '/'
    }
  }

  return (
    <header className="site-header" style={{ transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
      <div className="header-content">
        {/* Site Name - Center */}
        <a href="/" onClick={handleNameClick} className="site-name">
          Anoushka Garg
        </a>

        {/* Theme Toggle Button with Images - Right */}
        <button className="logo-container theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <Image
            id="main-logo"
            className="logo"
            src={SUN_IMAGE}
            alt="Light Mode"
            width={80}
            height={80}
            unoptimized
            priority
            style={{ display: theme === 'dark' ? 'none' : 'block' }}
          />
          <Image
            id="about-logo"
            className="logo"
            src={MOON_IMAGE}
            alt="Dark Mode"
            width={80}
            height={80}
            unoptimized
            priority
            style={{ display: theme === 'dark' ? 'block' : 'none' }}
          />
        </button>

        {/* Close Button - Only visible on about page */}
        {isAboutPage && (
          <Link href="/" className="close-button" aria-label="Return to homepage">
            <Image
              src="https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/t/679979bad465a26128bc2832/1738111418174/Clode.png"
              alt="Close"
              width={48}
              height={48}
              unoptimized
            />
          </Link>
        )}
      </div>
    </header>
  )
}

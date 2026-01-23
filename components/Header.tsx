'use client'

import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      clearTimeout(scrollTimeout)

      // Hide header when scrolling down, show when scrolling up or stopped
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      // Show header when scroll stops
      scrollTimeout = setTimeout(() => {
        setIsVisible(true)
      }, 150)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className="mx-auto flex items-center justify-center py-6 md:py-8 relative"
        style={{
          maxWidth: 'var(--max-width)',
          padding: 'var(--page-padding)',
        }}
      >
        {/* Centered Logo */}
        <Link
          href="/"
          className="text-[60px] md:text-[120px] leading-none font-space-grotesk font-normal hover:opacity-70 transition-opacity"
        >
          AG
        </Link>

        {/* Theme Toggle - Top Right */}
        <button
          onClick={toggleTheme}
          className="absolute right-[var(--page-padding)] top-6 md:top-8 text-xl md:text-2xl hover:opacity-70 transition-opacity"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '○' : '●'}
        </button>

        {/* Navigation - Desktop Only, positioned left */}
        <nav className="hidden md:flex absolute left-[var(--page-padding)] top-8 gap-6 text-sm">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Work
          </Link>
          <Link href="/about" className="hover:opacity-70 transition-opacity">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

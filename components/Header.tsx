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
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-space-grotesk font-bold hover:text-brand-green">
          AG
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-brand-green transition-colors">
            About
          </Link>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center hover:border-brand-green transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  )
}

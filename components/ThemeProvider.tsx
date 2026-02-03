'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with undefined to prevent hydration mismatch
  const [theme, setTheme] = useState<Theme | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user has manually set a theme preference
    const manualTheme = localStorage.getItem('theme-manual') as Theme | null

    if (manualTheme) {
      setTheme(manualTheme)
      document.documentElement.setAttribute('data-theme', manualTheme)
    } else {
      // Default to light theme if no manual preference
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    if (!theme) return
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    // Store as manual preference
    localStorage.setItem('theme-manual', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    // Remove time-based theme so manual theme takes precedence
    document.documentElement.removeAttribute('data-time-theme')
  }

  // Use 'light' as fallback during initial render
  const currentTheme = theme || 'light'

  return <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

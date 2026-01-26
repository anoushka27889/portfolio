'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user has manually set a theme preference
    const manualTheme = localStorage.getItem('theme-manual') as Theme | null

    if (manualTheme) {
      // User has manually set theme, respect that
      setTheme(manualTheme)
      document.documentElement.setAttribute('data-theme', manualTheme)
    } else {
      // Auto-detect based on time of day (simple: 6am-6pm is light, otherwise dark)
      const hour = new Date().getHours()
      const autoTheme = hour >= 6 && hour < 18 ? 'light' : 'dark'
      setTheme(autoTheme)
      document.documentElement.setAttribute('data-theme', autoTheme)
      localStorage.setItem('theme-auto', autoTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    // Store as manual preference
    localStorage.setItem('theme-manual', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

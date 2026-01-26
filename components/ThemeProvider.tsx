'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Calculate sunrise and sunset times based on user's location
// Using simplified algorithm based on latitude/longitude
function getSunriseSunset(lat: number, lng: number): { sunrise: Date; sunset: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  // Simplified solar calculation
  const latRad = (lat * Math.PI) / 180
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180)
  const declinationRad = (declination * Math.PI) / 180

  const hourAngle = Math.acos(
    -Math.tan(latRad) * Math.tan(declinationRad)
  )
  const hourAngleDeg = (hourAngle * 180) / Math.PI

  // Convert to hours (15 degrees per hour)
  const sunriseHour = 12 - hourAngleDeg / 15
  const sunsetHour = 12 + hourAngleDeg / 15

  // Account for longitude (4 minutes per degree)
  const lngOffset = lng / 15

  const sunrise = new Date(now)
  sunrise.setHours(Math.floor(sunriseHour - lngOffset), Math.round((sunriseHour - lngOffset - Math.floor(sunriseHour - lngOffset)) * 60), 0, 0)

  const sunset = new Date(now)
  sunset.setHours(Math.floor(sunsetHour - lngOffset), Math.round((sunsetHour - lngOffset - Math.floor(sunsetHour - lngOffset)) * 60), 0, 0)

  return { sunrise, sunset }
}

function isDaytime(lat: number, lng: number): boolean {
  const { sunrise, sunset } = getSunriseSunset(lat, lng)
  const now = new Date()
  return now >= sunrise && now <= sunset
}

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
      // Auto-detect based on location and time
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const autoTheme = isDaytime(latitude, longitude) ? 'light' : 'dark'
            setTheme(autoTheme)
            document.documentElement.setAttribute('data-theme', autoTheme)
            localStorage.setItem('theme-auto', autoTheme)
          },
          () => {
            // Fallback to system preference if location access denied
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            setTheme(systemTheme)
            document.documentElement.setAttribute('data-theme', systemTheme)
          }
        )
      } else {
        // Fallback to system preference if geolocation not available
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        setTheme(systemTheme)
        document.documentElement.setAttribute('data-theme', systemTheme)
      }
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

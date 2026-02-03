'use client'

import { useEffect } from 'react'

export default function TimeBasedTheme() {
  useEffect(() => {
    const updateTimeBasedTheme = () => {
      // Don't apply time-based theme if user has a manual preference
      const manualTheme = localStorage.getItem('theme-manual')
      if (manualTheme) {
        console.log('Time-based theme: skipped (manual theme active)')
        return
      }

      const hour = new Date().getHours()
      const shouldBeDark = hour < 6 || hour >= 18

      if (shouldBeDark) {
        document.documentElement.setAttribute('data-time-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-time-theme', 'light')
      }

      console.log('Time-based theme:', { hour, theme: shouldBeDark ? 'dark' : 'light' })
    }

    // Initial check
    updateTimeBasedTheme()

    // Update every minute
    const interval = setInterval(updateTimeBasedTheme, 60000)

    return () => clearInterval(interval)
  }, [])

  return null
}

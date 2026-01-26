'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track navigation start
    const navigationStart = performance.now()
    console.log(`[NAV] 🧭 Navigation to: ${pathname}`)
    console.log(`[NAV] 📍 Previous page: ${document.referrer || 'direct'}`)
    console.log(`[NAV] 🔍 Search params:`, searchParams?.toString() || 'none')

    // Track React hydration
    const hydrationStart = performance.now()
    console.log(`[NAV] 💧 Starting hydration at ${hydrationStart.toFixed(2)}ms`)

    // Check if this is a client-side navigation or initial load
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navigationEntries.length > 0) {
      const nav = navigationEntries[0]
      console.log(`[NAV] 📊 Navigation timing:`, {
        type: nav.type, // 'navigate', 'reload', 'back_forward', or 'prerender'
        redirectCount: nav.redirectCount,
        domContentLoaded: `${nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart}ms`,
        domComplete: `${nav.domComplete - nav.domInteractive}ms`,
        loadComplete: `${nav.loadEventEnd - nav.loadEventStart}ms`,
      })
    }

    // Track all pending network requests
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const pendingVideos = resources.filter(r => r.name.includes('.mp4') && !r.responseEnd)
    console.log(`[NAV] 📹 Pending video requests: ${pendingVideos.length}`)

    // Track React component tree size
    const componentCount = document.querySelectorAll('*').length
    console.log(`[NAV] 🌳 DOM nodes: ${componentCount}`)

    // Monitor for compilation issues (Next.js dev specific)
    const checkForCompiling = setInterval(() => {
      const compilingIndicator = document.querySelector('[data-nextjs-dialog-overlay], [class*="compiling"]')
      if (compilingIndicator) {
        console.warn(`[NAV] ⚠️  COMPILATION DETECTED - Next.js is recompiling!`)
        console.warn(`[NAV] ⚠️  This may indicate a hot reload loop or build issue`)
      }
    }, 500)

    // Track when page becomes interactive
    const checkInteractive = setInterval(() => {
      if (document.readyState === 'complete') {
        console.log(`[NAV] ✅ Page fully interactive at ${(performance.now() - navigationStart).toFixed(2)}ms`)
        clearInterval(checkInteractive)
      }
    }, 100)

    return () => {
      clearInterval(checkForCompiling)
      clearInterval(checkInteractive)
      console.log(`[NAV] 👋 Leaving: ${pathname}`)
    }
  }, [pathname, searchParams])

  return null
}

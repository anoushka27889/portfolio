'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PerformanceMonitor() {
  const pathname = usePathname()

  useEffect(() => {
    const startTime = performance.now()
    console.log(`[PERF] 🚀 Page mounted: ${pathname}`)
    console.log(`[PERF] ⏱️  Navigation start: ${startTime.toFixed(2)}ms`)

    // Log memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory
      console.log(`[PERF] 💾 Memory usage:`, {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      })
    }

    // Track video elements
    const videos = document.querySelectorAll('video')
    console.log(`[PERF] 🎬 Video elements found: ${videos.length}`)
    videos.forEach((video, index) => {
      console.log(`[PERF]   Video ${index + 1}:`, {
        src: video.src?.substring(video.src.lastIndexOf('/') + 1) || 'no src',
        readyState: video.readyState,
        networkState: video.networkState,
        duration: video.duration,
        paused: video.paused,
      })

      // Track video loading
      const videoLoadStart = performance.now()
      video.addEventListener('loadstart', () => {
        console.log(`[PERF] 🎬 Video ${index + 1} load started`)
      })
      video.addEventListener('loadedmetadata', () => {
        console.log(`[PERF] 🎬 Video ${index + 1} metadata loaded (${(performance.now() - videoLoadStart).toFixed(2)}ms)`)
      })
      video.addEventListener('loadeddata', () => {
        console.log(`[PERF] 🎬 Video ${index + 1} data loaded (${(performance.now() - videoLoadStart).toFixed(2)}ms)`)
      })
      video.addEventListener('canplay', () => {
        console.log(`[PERF] 🎬 Video ${index + 1} can play (${(performance.now() - videoLoadStart).toFixed(2)}ms)`)
      })
      video.addEventListener('error', (e) => {
        console.error(`[PERF] ❌ Video ${index + 1} error:`, e)
      })
    })

    // Track images
    const images = document.querySelectorAll('img')
    console.log(`[PERF] 🖼️  Images found: ${images.length}`)
    let imagesLoaded = 0
    images.forEach((img, index) => {
      if (img.complete) {
        imagesLoaded++
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++
          console.log(`[PERF] 🖼️  Image ${index + 1}/${images.length} loaded`)
        })
        img.addEventListener('error', () => {
          console.error(`[PERF] ❌ Image ${index + 1} failed to load:`, img.src)
        })
      }
    })
    console.log(`[PERF] 🖼️  Images already loaded: ${imagesLoaded}/${images.length}`)

    // Track component mount time
    const mountTime = performance.now() - startTime
    console.log(`[PERF] ✅ Component fully mounted in ${mountTime.toFixed(2)}ms`)

    // Set up performance observer for long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`[PERF] ⚠️  Long task detected (${entry.duration.toFixed(2)}ms):`, entry)
          }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })

        // Observe resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resource = entry as PerformanceResourceTiming
              if (resource.name.includes('/media/') || resource.name.includes('.mp4')) {
                console.log(`[PERF] 📥 Resource loaded:`, {
                  name: resource.name.substring(resource.name.lastIndexOf('/') + 1),
                  size: `${(resource.transferSize / 1024).toFixed(2)} KB`,
                  duration: `${resource.duration.toFixed(2)}ms`,
                  type: resource.initiatorType,
                })
              }
            }
          }
        })
        resourceObserver.observe({ entryTypes: ['resource'] })

        return () => {
          longTaskObserver.disconnect()
          resourceObserver.disconnect()
        }
      } catch (e) {
        console.log('[PERF] Performance Observer not fully supported')
      }
    }

    // Cleanup
    return () => {
      const endTime = performance.now()
      console.log(`[PERF] 🏁 Page unmounting: ${pathname}`)
      console.log(`[PERF] ⏱️  Total time on page: ${(endTime - startTime).toFixed(2)}ms`)

      // Log memory again on unmount
      if ('memory' in performance) {
        const memory = (performance as any).memory
        console.log(`[PERF] 💾 Memory at unmount:`, {
          used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        })
      }
    }
  }, [pathname])

  // Track route changes
  useEffect(() => {
    console.log(`[PERF] 🔀 Route changed to: ${pathname}`)
  }, [pathname])

  return null
}

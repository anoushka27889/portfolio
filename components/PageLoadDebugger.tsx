'use client'

import { useEffect, useRef } from 'react'

interface PageLoadDebuggerProps {
  pageName: string
}

export default function PageLoadDebugger({ pageName }: PageLoadDebuggerProps) {
  const mountTimeRef = useRef(performance.now())
  const componentLoadTimes = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const mountTime = mountTimeRef.current
    console.group(`[DEBUG ${pageName}] 🔍 Page Load Analysis`)
    console.log(`[DEBUG ${pageName}] ⏱️  Mount started at: ${mountTime.toFixed(2)}ms`)

    // Check if we came from homepage
    const referrer = document.referrer
    const fromHomepage = referrer.includes('localhost:3000') && !referrer.includes(pageName.toLowerCase())
    console.log(`[DEBUG ${pageName}] 🏠 Navigated from homepage: ${fromHomepage}`)
    console.log(`[DEBUG ${pageName}] 📍 Referrer: ${referrer || 'direct'}`)

    // Track all videos specifically
    const trackVideos = () => {
      const videos = Array.from(document.querySelectorAll('video'))
      console.log(`[DEBUG ${pageName}] 🎬 Total videos: ${videos.length}`)

      videos.forEach((video, index) => {
        const videoInfo = {
          id: `video-${index}`,
          src: video.src?.split('/').pop() || 'unknown',
          currentSrc: video.currentSrc?.split('/').pop() || 'none',
          readyState: ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'][video.readyState],
          networkState: ['NETWORK_EMPTY', 'NETWORK_IDLE', 'NETWORK_LOADING', 'NETWORK_NO_SOURCE'][video.networkState],
          paused: video.paused,
          autoplay: video.autoplay,
          loop: video.loop,
          muted: video.muted,
          hasAudio: !video.muted,
          duration: video.duration || 'unknown',
          buffered: video.buffered.length > 0 ? `${video.buffered.end(0).toFixed(2)}s` : '0s',
        }
        console.log(`[DEBUG ${pageName}]   📹 Video ${index + 1}:`, videoInfo)

        // Track video events
        const events = ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'playing', 'waiting', 'stalled', 'suspend', 'error']
        events.forEach(eventName => {
          video.addEventListener(eventName, (e) => {
            console.log(`[DEBUG ${pageName}] 🎬 Video ${index + 1} event: ${eventName}`, {
              currentTime: video.currentTime,
              readyState: video.readyState,
            })
            if (eventName === 'error') {
              console.error(`[DEBUG ${pageName}] ❌ Video ${index + 1} error:`, video.error)
            }
          })
        })
      })
    }

    // Initial video tracking
    trackVideos()

    // Track video elements added after initial render
    const observer = new MutationObserver(() => {
      const currentVideoCount = document.querySelectorAll('video').length
      if (componentLoadTimes.current.get('video-count') !== currentVideoCount) {
        console.log(`[DEBUG ${pageName}] 🔄 Video count changed to: ${currentVideoCount}`)
        componentLoadTimes.current.set('video-count', currentVideoCount)
        trackVideos()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Track AutoplayVideo components specifically
    const autoplayVideos = document.querySelectorAll('[class*="video-container"]')
    console.log(`[DEBUG ${pageName}] 🎮 AutoplayVideo components: ${autoplayVideos.length}`)

    // Check for memory pressure
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = memory.usedJSHeapSize / 1048576
      const totalMB = memory.totalJSHeapSize / 1048576
      const limitMB = memory.jsHeapSizeLimit / 1048576
      const percentUsed = (usedMB / limitMB) * 100

      console.log(`[DEBUG ${pageName}] 💾 Memory:`, {
        used: `${usedMB.toFixed(2)} MB`,
        total: `${totalMB.toFixed(2)} MB`,
        limit: `${limitMB.toFixed(2)} MB`,
        percentUsed: `${percentUsed.toFixed(2)}%`,
      })

      if (percentUsed > 80) {
        console.warn(`[DEBUG ${pageName}] ⚠️  HIGH MEMORY USAGE: ${percentUsed.toFixed(2)}%`)
      }
    }

    // Track network requests
    const pendingRequests = performance.getEntriesByType('resource').filter(
      (r: any) => !r.responseEnd
    )
    console.log(`[DEBUG ${pageName}] 🌐 Pending network requests: ${pendingRequests.length}`)

    // Check for React component issues
    const checkReactState = () => {
      const reactRoot = document.querySelector('#__next, [data-reactroot]')
      if (!reactRoot) {
        console.warn(`[DEBUG ${pageName}] ⚠️  No React root found!`)
      }
    }
    checkReactState()

    // Monitor for infinite re-renders
    let renderCount = 0
    const renderCheckInterval = setInterval(() => {
      renderCount++
      if (renderCount > 10) {
        console.warn(`[DEBUG ${pageName}] ⚠️  Possible infinite render loop detected (${renderCount} checks)`)
        clearInterval(renderCheckInterval)
      }
    }, 100)

    // Final timing
    setTimeout(() => {
      const finalTime = performance.now() - mountTime
      console.log(`[DEBUG ${pageName}] ✅ Component stable after ${finalTime.toFixed(2)}ms`)
      console.groupEnd()
      clearInterval(renderCheckInterval)
    }, 2000)

    return () => {
      observer.disconnect()
      clearInterval(renderCheckInterval)
      const unmountTime = performance.now() - mountTime
      console.log(`[DEBUG ${pageName}] 👋 Unmounting after ${unmountTime.toFixed(2)}ms`)
    }
  }, [pageName])

  return null
}

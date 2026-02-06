'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageGallery from './ImageGallery'
import { projects } from '@/lib/projects-data'
import { Fragment, useState, useEffect, useRef } from 'react'

export default function WorkContainer() {
  const router = useRouter()
  const [visibleSlideshows, setVisibleSlideshows] = useState<Set<number>>(new Set([0, 1])) // Load first 2 slideshows immediately
  const observersRef = useRef<IntersectionObserver[]>([])

  // Cleanup observers on unmount
  useEffect(() => {
    return () => {
      observersRef.current.forEach(observer => observer.disconnect())
      observersRef.current = []
    }
  }, [])

  const handleSlideshowClick = (e: React.MouseEvent, url: string) => {
    // Don't navigate if clicking on slideshow navigation buttons
    const target = e.target as HTMLElement
    if (target.closest('.slideshow-nav')) {
      return
    }
    router.push(url)
  }

  const slideshowRef = (index: number) => (node: HTMLDivElement | null) => {
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleSlideshows(prev => new Set(prev).add(index))
          observer.disconnect() // Only need to load once
        }
      },
      {
        rootMargin: '400px', // Start loading 400px before entering viewport (one half scroll)
        threshold: 0.1
      }
    )

    observer.observe(node)
    observersRef.current.push(observer)
  }

  return (
    <div className="work-container">
      {projects.map((project, index) => (
        <Fragment key={project.id}>
          {/* Slideshow - comes first (columns 1-2) */}
          {project.hasCaseStudy ? (
            <div
              ref={slideshowRef(index)}
              className="slideshow-link"
              onClick={(e) => handleSlideshowClick(e, project.url!)}
            >
              {visibleSlideshows.has(index) ? (
                <ImageGallery images={project.images} slideshowIndex={index} />
              ) : (
                <div style={{ width: '100%', paddingBottom: '66.67%', backgroundColor: '#f0f0f0' }} />
              )}
            </div>
          ) : (
            <div ref={slideshowRef(index)} className="slideshow-link">
              {visibleSlideshows.has(index) ? (
                <ImageGallery images={project.images} slideshowIndex={index} />
              ) : (
                <div style={{ width: '100%', paddingBottom: '66.67%', backgroundColor: '#f0f0f0' }} />
              )}
            </div>
          )}

          {/* Content - comes second (column 3) */}
          <div className="project-content">
            <div className="project-meta">
              <span className="project-client">{project.client}</span>
              <span className="project-year">{project.year}</span>
            </div>

            {project.hasCaseStudy ? (
              <Link href={project.url!} className="project-content-link">
                <h2 className="project-title">{project.title}</h2>
                <svg className="project-arrow" width="75" height="16" viewBox="0 0 75 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="8" x2="70" y2="8" stroke="currentColor" strokeWidth="0.75"/>
                  <path d="M65 3L70 8L65 13" stroke="currentColor" strokeWidth="0.75" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </Link>
            ) : (
              <>
                <h2 className="project-title">{project.title}</h2>
                <span className="coming-soon-text">Case study coming soon</span>
              </>
            )}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

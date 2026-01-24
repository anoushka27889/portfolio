'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageGallery from './ImageGallery'
import { projects } from '@/lib/projects-data'
import { Fragment } from 'react'

export default function WorkContainer() {
  const router = useRouter()

  const handleSlideshowClick = (e: React.MouseEvent, url: string) => {
    // Don't navigate if clicking on slideshow navigation buttons
    const target = e.target as HTMLElement
    if (target.closest('.slideshow-nav')) {
      return
    }
    router.push(url)
  }

  return (
    <div className="work-container">
      {projects.map((project, index) => (
        <Fragment key={project.id}>
          {/* Slideshow - comes first (columns 1-2) */}
          {project.hasCaseStudy ? (
            <div
              className="slideshow-link"
              onClick={(e) => handleSlideshowClick(e, project.url!)}
            >
              <ImageGallery images={project.images} slideshowIndex={index} />
            </div>
          ) : (
            <div className="slideshow-link">
              <ImageGallery images={project.images} slideshowIndex={index} />
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
                <h2 className="project-title">
                  <a href={project.url!}>{project.title}</a>
                </h2>
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

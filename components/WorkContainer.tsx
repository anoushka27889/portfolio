'use client'

import Link from 'next/link'
import ImageGallery from './ImageGallery'
import { projects } from '@/lib/projects-data'
import { Fragment } from 'react'

export default function WorkContainer() {
  return (
    <div className="work-container">
      {projects.map((project, index) => (
        <Fragment key={project.id}>
          {/* Slideshow - comes first (columns 1-2) */}
          {project.hasCaseStudy ? (
            <Link href={project.url!} className="slideshow-link">
              <ImageGallery images={project.images} slideshowIndex={index} />
            </Link>
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
                <div className="project-arrow" />
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

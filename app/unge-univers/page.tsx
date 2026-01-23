import { projects } from '@/lib/projects-data'
import ImageGallery from '@/components/ImageGallery'
import Link from 'next/link'

export default function UngeUniversPage() {
  const project = projects.find(p => p.id === 4)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <article className="project-detail">
      <div className="project-detail-container-wide">
        {/* Back Link */}
        <Link href="/" className="back-link">
          ← Back to work
        </Link>

        {/* 3-Column Grid Layout */}
        <div className="work-container">
          {/* Image Gallery - Spans 2 columns */}
          <div className="project-detail-gallery-grid">
            {project.images && project.images.length > 0 && (
              <ImageGallery images={project.images} slideshowIndex={project.id} />
            )}
          </div>

          {/* Project Info - Spans 1 column */}
          <div className="project-detail-info">
            <div className="project-detail-meta">
              <span className="project-detail-client">{project.client}</span>
              <span className="project-detail-year">{project.year}</span>
            </div>
            <h1 className="project-detail-title">{project.title}</h1>
            {project.description && (
              <p className="project-detail-description">{project.description}</p>
            )}
          </div>
        </div>

        {/* Full-Width Content Section */}
        <div className="project-detail-content">
          <p>Case study content coming soon...</p>
        </div>

        {/* Navigation */}
        <footer className="project-detail-footer">
          <Link href="/" className="back-link">
            ← View all projects
          </Link>
        </footer>
      </div>
    </article>
  )
}

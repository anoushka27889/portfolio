import { notFound } from 'next/navigation'
import { projects } from '@/lib/projects-data'
import ImageGallery from '@/components/ImageGallery'
import Link from 'next/link'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

// Map URL slugs to project IDs
const slugToId: { [key: string]: number } = {
  'rest': 2,
  'lumen': 3,
  'unge-univers': 4,
  'fotex': 5,
  'upp': 6,
  'the-other-side': 7
}

export async function generateStaticParams() {
  return Object.keys(slugToId).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const projectId = slugToId[slug]
  const project = projects.find(p => p.id === projectId)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} - Anoushka Garg`,
    description: project.description || project.title,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projectId = slugToId[slug]
  const project = projects.find(p => p.id === projectId)

  if (!project) {
    notFound()
  }

  return (
    <article className="project-detail">
      <div className="project-detail-container">
        {/* Back Link */}
        <Link href="/" className="back-link">
          ← Back to work
        </Link>

        {/* Project Header */}
        <header className="project-detail-header">
          <div className="project-detail-meta">
            <span className="project-detail-client">{project.client}</span>
            <span className="project-detail-year">{project.year}</span>
          </div>
          <h1 className="project-detail-title">{project.title}</h1>
          {project.description && (
            <p className="project-detail-description">{project.description}</p>
          )}
        </header>

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="project-detail-gallery">
            <ImageGallery images={project.images} slideshowIndex={project.id} />
          </div>
        )}

        {/* Content placeholder */}
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

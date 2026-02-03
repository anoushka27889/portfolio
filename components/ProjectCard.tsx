import Link from 'next/link'
import ImageGallery from './ImageGallery'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="group"
      style={{
        paddingLeft: 'var(--gutter-mobile)',
        paddingRight: 'var(--gutter-mobile)',
      }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        {/* Image Gallery */}
        <div className="mb-6 md:mb-8">
          <ImageGallery images={project.images} slideshowIndex={0} />
        </div>

        {/* Project Info */}
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-space-grotesk font-normal group-hover:opacity-70 transition-opacity">
            {project.title}
          </h3>

          <p className="text-sm md:text-base opacity-70">{project.description}</p>

          {project.awards && project.awards.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.awards.map((award, index) => (
                <span key={index} className="text-xs opacity-50">
                  {award}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}

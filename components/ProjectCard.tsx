import Link from 'next/link'
import ImageGallery from './ImageGallery'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group">
      <Link href={`/projects/${project.slug}`} className="block">
        {/* Image Gallery */}
        <div className="mb-4">
          <ImageGallery images={project.images} alt={project.title} />
        </div>

        {/* Project Info */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-2xl font-space-grotesk font-bold group-hover:text-brand-green transition-colors">
              {project.title}
            </h3>
            <span className="text-sm opacity-60 whitespace-nowrap">{project.year}</span>
          </div>

          <p className="text-base opacity-80">{project.description}</p>

          {project.awards && project.awards.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.awards.map((award, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20"
                >
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

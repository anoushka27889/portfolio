import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjects } from '@/lib/projects'
import { MDXRemote } from 'next-mdx-remote/rsc'
import ImageGallery from '@/components/ImageGallery'
import Link from 'next/link'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} - Anoushka Garg`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <article className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 hover:text-brand-green transition-colors"
        >
          ← Back to work
        </Link>

        {/* Project Header */}
        <header className="mb-12">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold">
              {project.title}
            </h1>
            <span className="text-lg opacity-60 whitespace-nowrap">{project.year}</span>
          </div>
          <p className="text-xl md:text-2xl opacity-90">{project.description}</p>

          {project.awards && project.awards.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {project.awards.map((award, index) => (
                <span
                  key={index}
                  className="text-sm px-4 py-2 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20"
                >
                  {award}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="mb-12">
            <ImageGallery images={project.images} alt={project.title} />
          </div>
        )}

        {/* MDX Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-space-grotesk prose-headings:font-bold prose-a:text-brand-green hover:prose-a:underline">
          {project.content && <MDXRemote source={project.content} />}
        </div>

        {/* Navigation */}
        <footer className="mt-16 pt-8 border-t border-current">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg hover:text-brand-green transition-colors"
          >
            ← View all projects
          </Link>
        </footer>
      </div>
    </article>
  )
}

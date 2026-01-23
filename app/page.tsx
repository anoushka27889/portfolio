import { getAllProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

export default function Home() {
  const projects = getAllProjects()

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Hero Section */}
        <section className="mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-space-grotesk font-bold mb-6 leading-tight">
            Anoushka Garg
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl opacity-90">
            Product designer crafting thoughtful experiences for people and their families.
          </p>
        </section>

        {/* Projects Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-space-grotesk font-bold mb-8">Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {/* Awards Section */}
        <section className="border-t border-current pt-12">
          <h2 className="text-2xl font-space-grotesk font-bold mb-6">Recognition</h2>
          <p className="opacity-80">
            Awards and recognition section coming soon...{' '}
            <Link href="/about" className="text-brand-green hover:underline">
              Learn more about my work
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

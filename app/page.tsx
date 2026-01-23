import { getAllProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'

export default function Home() {
  const projects = getAllProjects()

  return (
    <div
      className="min-h-screen"
      style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '180px var(--page-padding) 80px',
      }}
    >
      {/* Hero Bio Section */}
      <section
        className="mb-20 md:mb-32"
        style={{
          paddingLeft: 'var(--gutter-mobile)',
          paddingRight: 'var(--gutter-mobile)',
        }}
      >
        <p className="text-base md:text-lg max-w-3xl">
          I'm a product designer specializing in creating thoughtful digital experiences for people
          and their families. Currently working on sleep and wellness products at Hatch.
        </p>
      </section>

      {/* Projects Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-24 md:gap-y-32">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}

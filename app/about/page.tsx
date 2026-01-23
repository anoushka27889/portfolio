import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - Anoushka Garg',
  description: 'Learn more about Anoushka Garg, product designer',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold mb-6">
            About
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Product designer with a passion for creating meaningful experiences that improve
            people's lives.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-space-grotesk prose-headings:font-bold">
          <h2>Background</h2>
          <p>
            I'm a product designer specializing in user experience and interaction design. My work
            focuses on crafting thoughtful digital experiences for people and their families.
          </p>

          <h2>Approach</h2>
          <p>
            I believe great design comes from deep empathy and understanding of user needs. My
            process involves extensive research, iterative prototyping, and close collaboration with
            cross-functional teams.
          </p>

          <h2>Experience</h2>
          <p>
            Throughout my career, I've worked on projects ranging from consumer hardware experiences
            to healthcare applications, always with a focus on accessibility and user-centered
            design.
          </p>

          <h2>Get in Touch</h2>
          <p>
            I'm always interested in hearing about new opportunities and collaborations.
            <br />
            <a href="mailto:hello@anoushkagarg.com" className="text-brand-green hover:underline">
              hello@anoushkagarg.com
            </a>
          </p>

          <div className="flex gap-4 mt-8">
            <a
              href="https://linkedin.com/in/anoushkagarg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green hover:underline"
            >
              LinkedIn
            </a>
            <span className="opacity-30">•</span>
            <a
              href="mailto:hello@anoushkagarg.com"
              className="text-brand-green hover:underline"
            >
              Email
            </a>
          </div>
        </div>

        {/* Back Link */}
        <footer className="mt-16 pt-8 border-t border-current">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg hover:text-brand-green transition-colors"
          >
            ← Back to work
          </Link>
        </footer>
      </div>
    </div>
  )
}

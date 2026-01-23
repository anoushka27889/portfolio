import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Project, ProjectMetadata } from './types'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

export function getProjectSlugs(): string[] {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      return []
    }
    return fs.readdirSync(projectsDirectory).filter((file) => file.endsWith('.mdx'))
  } catch (error) {
    console.error('Error reading projects directory:', error)
    return []
  }
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const realSlug = slug.replace(/\.mdx$/, '')
    const fullPath = path.join(projectsDirectory, `${realSlug}.mdx`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: realSlug,
      ...(data as ProjectMetadata),
      content,
    }
  } catch (error) {
    console.error(`Error reading project ${slug}:`, error)
    return null
  }
}

export function getAllProjects(): Project[] {
  const slugs = getProjectSlugs()
  const projects = slugs
    .map((slug) => getProjectBySlug(slug.replace(/\.mdx$/, '')))
    .filter((project): project is Project => project !== null)
    .sort((a, b) => a.order - b.order)

  return projects
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured)
}

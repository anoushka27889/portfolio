export interface Project {
  slug: string
  title: string
  description: string
  year: string
  order: number
  featured: boolean
  images: string[]
  video?: string
  awards?: string[]
  content?: string
}

export interface ProjectMetadata {
  title: string
  description: string
  year: string
  order: number
  featured: boolean
  images: string[]
  video?: string
  awards?: string[]
}

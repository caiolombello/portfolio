export interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  imageUrl: string
  category: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
} 
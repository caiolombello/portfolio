export interface Project {
  id: string
  title_en: string
  title_pt: string
  shortDescription_en: string
  shortDescription_pt: string
  description_en: string
  description_pt: string
  title?: string
  shortDescription?: string
  description?: string
  imageUrl: string
  category: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
} 
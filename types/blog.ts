export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  date: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
} 
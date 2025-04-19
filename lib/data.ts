import fs from "fs"
import path from "path"
import matter from "gray-matter"

import { Project } from "@/types/project"

export interface Profile {
  name: string
  title: string
  bio: string
  email: string
  location: string
  avatar: string
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
    instagram?: string
    website?: string
  }
}

export interface Skill {
  name: string
  level: number
  category: string
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  technologies: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  description: string
}

export interface Certification {
  name: string
  issuer: string
  date: string
  description: string
  url?: string
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const filePath = path.join(process.cwd(), "public/data/profile.json")
    if (!fs.existsSync(filePath)) return null
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Erro ao carregar profile:", error)
    return null
  }
}

export function getAllProjects(): Project[] {
  const dir = path.join(process.cwd(), "content/projects")
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"))
  return files.map(file => {
    const filePath = path.join(dir, file)
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  })
}

export function getProjectById(id: string): Project | null {
  const filePath = path.join(process.cwd(), "content/projects", `${id}.json`)
  if (!fs.existsSync(filePath)) return null
  const data = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(data)
}

export interface BlogPost {
  id: string
  title_en: string
  title_pt: string
  summary_en: string
  summary_pt: string
  body_en: string
  body_pt: string
  // Campos antigos para compatibilidade
  title?: string
  summary?: string
  content?: string
  coverImage?: string
  date: string
  author?: {
    name: string
    avatar?: string
  }
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
  slug: string
  excerpt: string
}

export function getAllPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), "content/posts")
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"))
  return files.map(file => {
    const filePath = path.join(dir, file)
    const raw = fs.readFileSync(filePath, "utf-8")
    const { data } = matter(raw)
    return {
      id: data.id || file.replace(/\.md$/, ""),
      title_en: data.title_en || "",
      title_pt: data.title_pt || "",
      summary_en: data.summary_en || "",
      summary_pt: data.summary_pt || "",
      body_en: data.body_en || "",
      body_pt: data.body_pt || "",
      title: data.title_en || data.title_pt || data.title,
      summary: data.summary_en || data.summary_pt || data.summary,
      content: data.body_en || data.body_pt || data.body,
      slug: data.slug || file.replace(/\.md$/, ""),
      excerpt: data.excerpt || data.summary_en || data.summary_pt || data.summary || "",
      coverImage: data.imageUrl || data.coverImage,
      date: data.publicationDate || data.date || "",
      author: data.author || { name: "", avatar: "" },
      tags: data.tags || [data.category].filter(Boolean) || [],
      published: data.published ?? true,
      createdAt: data.createdAt || data.publicationDate || "",
      updatedAt: data.updatedAt || data.publicationDate || "",
    } as BlogPost
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(process.cwd(), "content/posts", `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data } = matter(raw)
  return {
    id: data.id || slug,
    title_en: data.title_en || "",
    title_pt: data.title_pt || "",
    summary_en: data.summary_en || "",
    summary_pt: data.summary_pt || "",
    body_en: data.body_en || "",
    body_pt: data.body_pt || "",
    title: data.title_en || data.title_pt || data.title,
    summary: data.summary_en || data.summary_pt || data.summary,
    content: data.body_en || data.body_pt || data.body,
    slug: data.slug || slug,
    excerpt: data.excerpt || data.summary_en || data.summary_pt || data.summary || "",
    coverImage: data.imageUrl || data.coverImage,
    date: data.publicationDate || data.date || "",
    author: data.author || { name: "", avatar: "" },
    tags: data.tags || [data.category].filter(Boolean) || [],
    published: data.published ?? true,
    createdAt: data.createdAt || data.publicationDate || "",
    updatedAt: data.updatedAt || data.publicationDate || "",
  } as BlogPost
}

// Outras funções de dados permanecem inalteradas...


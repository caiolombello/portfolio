import type { MetadataRoute } from "next"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com"

  // Páginas estáticas
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.1,
    },
  ]

  // Adicionar páginas de projetos
  let projectPages: { url: string; lastModified: Date }[] = []
  try {
    const projectsDir = path.join(process.cwd(), "content/projects")
    const projectFiles = fs.readdirSync(projectsDir).filter(f => f.endsWith(".json"))
    projectPages = projectFiles.map((file) => {
      const filePath = path.join(projectsDir, file)
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
      return {
        url: `${baseUrl}/portfolio/${data.id}`,
        lastModified: new Date(),
      }
    })
  } catch (error) {
    console.error("Erro ao carregar projetos para sitemap:", error)
  }

  // Carregar posts do blog dinâmicos
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const postsDir = path.join(process.cwd(), "content/posts")
    const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"))
    blogPages = postFiles.map((file) => {
      const filePath = path.join(postsDir, file)
      const raw = fs.readFileSync(filePath, "utf-8")
      const { data } = matter(raw)
      return {
        url: `${baseUrl}/blog/${file.replace(/\.md$/, "")}`,
        lastModified: new Date(data.publicationDate),
        changeFrequency: "monthly" as ChangeFrequency,
        priority: 0.7,
      }
    })
  } catch (error) {
    console.error("Erro ao carregar posts para sitemap:", error)
  }

  // Adicionar páginas alternativas de idioma
  const alternatePages = staticPages.map((page) => ({
    ...page,
    url: `${page.url}/en`,
    priority: page.priority - 0.1,
  }))

  return [...staticPages, ...alternatePages, ...projectPages, ...blogPages]
}


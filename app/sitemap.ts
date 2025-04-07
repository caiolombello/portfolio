import type { MetadataRoute } from "next"
import { getBlob } from "@/lib/blob-storage"

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
  const projectsBlob = await getBlob("projects.json")
  if (projectsBlob) {
    const projectsData = JSON.parse(projectsBlob)
    projectPages = projectsData.map((project: any) => ({
      url: `${baseUrl}/portfolio/${project.id}`,
      lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
    }))
  }

  // Carregar posts do blog dinâmicos
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const postsBlob = await getBlob("posts.json")
    if (postsBlob) {
      const postsData = JSON.parse(postsBlob)
      blogPages = postsData.map((post: any) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: new Date(post.publicationDate),
        changeFrequency: "monthly" as ChangeFrequency,
        priority: 0.7,
      }))
    }
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


import type { MetadataRoute } from "next"
import { getBlob } from "@/lib/blob-storage"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caiolombelllo.com"

  // Páginas estáticas
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
  ]

  // Carregar projetos dinâmicos
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const projectsBlob = await getBlob("projects.json")
    if (projectsBlob) {
      const projectsData = JSON.parse(await projectsBlob.text())
      projectPages = projectsData.map((project: any) => ({
        url: `${baseUrl}/portfolio/${project.id}`,
        lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
        changeFrequency: "monthly",
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error("Erro ao carregar projetos para sitemap:", error)
  }

  // Carregar posts do blog dinâmicos
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const postsBlob = await getBlob("posts.json")
    if (postsBlob) {
      const postsData = JSON.parse(await postsBlob.text())
      blogPages = postsData.map((post: any) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: new Date(post.publicationDate),
        changeFrequency: "monthly",
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


import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { loadPosts } from "@/lib/data";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com";

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

  ];

  // Adicionar páginas de projetos
  let projectPages: { url: string; lastModified: Date }[] = [];
  try {
    const projectsDir = path.join(process.cwd(), "content/projects");
    ensureDirectoryExists(projectsDir);

    if (fs.existsSync(projectsDir)) {
      const projectFiles = fs
        .readdirSync(projectsDir)
        .filter((f) => f.endsWith(".json"));
      projectPages = projectFiles.map((file) => {
        const filePath = path.join(projectsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return {
          url: `${baseUrl}/portfolio/${data.id}`,
          lastModified: new Date(),
        };
      });
    }
  } catch (error) {
    console.error("Erro ao carregar projetos para sitemap:", error);
  }

  // Carregar posts do blog dinâmicos
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await loadPosts();
    blogPages = posts.flatMap((post: any) => {
      const pages = [];

      if (post.slug_pt) {
        pages.push({
          url: `${baseUrl}/blog/${post.slug_pt}`,
          lastModified: new Date(post.publicationDate),
          changeFrequency: "monthly" as ChangeFrequency,
          priority: 0.7,
        });
      }

      if (post.slug_en) {
        pages.push({
          url: `${baseUrl}/blog/${post.slug_en}`,
          lastModified: new Date(post.publicationDate),
          changeFrequency: "monthly" as ChangeFrequency,
          priority: 0.7,
        });
      }

      return pages;
    });
  } catch (error) {
    console.error("Erro ao carregar posts para sitemap:", error);
  }

  // Adicionar páginas alternativas de idioma
  const alternatePages = staticPages.map((page) => ({
    ...page,
    url: `${page.url}/en`,
    priority: page.priority - 0.1,
  }));

  return [...staticPages, ...alternatePages, ...projectPages, ...blogPages];
}

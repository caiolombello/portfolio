import type { MetadataRoute } from "next";
import { parseBlogDate } from "./blog-date";

interface SitemapPost {
  slug_pt?: string;
  slug_en?: string;
  publicationDate: string;
  updatedAt?: string;
}

interface SitemapProject {
  id: string;
  updatedAt?: string;
}

interface SitemapOptions {
  baseUrl: string;
  portfolioEnabled: boolean;
  posts: SitemapPost[];
  projects: SitemapProject[];
}

function pageUrl(baseUrl: string, path: string): string {
  return new URL(path, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

export function buildRobots(baseUrl: string): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: pageUrl(baseUrl, "/sitemap.xml"),
  };
}

export function buildSitemap({
  baseUrl,
  portfolioEnabled,
  posts,
  projects,
}: SitemapOptions): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: pageUrl(baseUrl, "/") },
    { url: pageUrl(baseUrl, "/resume") },
    { url: pageUrl(baseUrl, "/blog") },
    { url: pageUrl(baseUrl, "/contact") },
    { url: pageUrl(baseUrl, "/en") },
    { url: pageUrl(baseUrl, "/en/resume") },
    { url: pageUrl(baseUrl, "/en/blog") },
    { url: pageUrl(baseUrl, "/en/contact") },
  ];

  if (portfolioEnabled) {
    staticPages.push({ url: pageUrl(baseUrl, "/portfolio") });
    staticPages.push({ url: pageUrl(baseUrl, "/en/portfolio") });
  }

  const projectPages: MetadataRoute.Sitemap = portfolioEnabled
    ? projects.map((project) => ({
        url: pageUrl(baseUrl, `/portfolio/${project.id}`),
        ...(project.updatedAt
          ? { lastModified: new Date(project.updatedAt) }
          : {}),
      }))
    : [];

  const postPages = posts.flatMap((post) => {
    const lastModified = parseBlogDate(
      post.updatedAt || post.publicationDate,
    );
    return [
      ...(post.slug_pt
        ? [
            {
              url: pageUrl(baseUrl, `/blog/${post.slug_pt}`),
              lastModified,
            },
          ]
        : []),
      ...(post.slug_en
        ? [
            {
              url: pageUrl(baseUrl, `/blog/${post.slug_en}`),
              lastModified,
            },
          ]
        : []),
    ];
  });

  return [...staticPages, ...projectPages, ...postPages];
}

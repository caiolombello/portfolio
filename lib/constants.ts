export const SITE_CONFIG = {
  name: "Caio Barbieri Portfolio",
  description: "Professional portfolio showcasing my work and experience",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/caiolombello",
    linkedin: "https://linkedin.com/in/caiolvbarbieri",
  },
} as const;

export const CONTENT_PATHS = {
  posts: "content/posts",
  projects: "content/projects",
  data: "public/data",
} as const;

export const SUPPORTED_LOCALES = ["en", "pt", "es"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE = "en" as const;

export const REVALIDATE_TIMES = {
  page: 3600, // 1 hour
  feed: 600, // 10 minutes
  static: 86400, // 24 hours
} as const;

export const API_ENDPOINTS = {
  webhook: "/api/webhook",
  revalidate: "/api/revalidate",
  medium: "/api/medium/posts",
} as const;

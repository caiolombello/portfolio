import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/_next/",
        "/static/",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com"}/sitemap.xml`,
  }
} 
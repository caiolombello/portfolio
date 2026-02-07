import { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/config-server";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteConfig().site.url;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

import { loadPosts, loadProjects } from "@/lib/data";
import { getSiteConfig } from "@/lib/config-server";
import { buildSitemap } from "@/lib/seo-routes";
import { isPortfolioEnabled } from "@/lib/site-features";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getSiteConfig();
  const portfolioEnabled = isPortfolioEnabled(config);
  const posts = await loadPosts();
  const projects = portfolioEnabled ? await loadProjects() : [];

  return buildSitemap({
    baseUrl: config.site.url,
    portfolioEnabled,
    posts,
    projects,
  });
}

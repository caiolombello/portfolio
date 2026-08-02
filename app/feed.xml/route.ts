import { getSiteConfig } from "@/lib/site-metadata";
import { loadPosts } from "@/lib/data";
import { buildBlogFeed } from "@/lib/blog-feed";

export async function GET() {
  const siteConfig = getSiteConfig();
  const posts = await loadPosts();
  const rss = buildBlogFeed({
    baseUrl: siteConfig.site.url,
    description: siteConfig.site.description,
    posts,
    title: `${siteConfig.site.author} — Blog técnico`,
  });

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

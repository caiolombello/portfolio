import { getSiteConfig } from "@/lib/site-metadata";
import { loadPosts } from "@/lib/data";

export async function GET() {
  const siteConfig = getSiteConfig();
  const posts = await loadPosts();
  const baseUrl = siteConfig.site.url;

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.site.title}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.site.description}</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        const url = `${baseUrl}/blog/${post.slug_pt || post.slug_en}`;
        const title = post.title_pt || post.title_en;
        const description = post.summary_pt || post.summary_en;

        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publicationDate).toUTCString()}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

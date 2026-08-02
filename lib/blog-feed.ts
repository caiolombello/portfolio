import { parseBlogDate } from "./blog-date";

interface FeedPost {
  publicationDate: string;
  slug_en: string;
  slug_pt: string;
  summary_en: string;
  summary_pt: string;
  title_en: string;
  title_pt: string;
  updatedAt?: string;
}

interface BlogFeedOptions {
  baseUrl: string;
  description: string;
  posts: FeedPost[];
  title: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cdata(value: string): string {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

export function buildBlogFeed({
  baseUrl,
  description,
  posts,
  title,
}: BlogFeedOptions): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const latestDate = posts
    .map((post) => post.updatedAt || post.publicationDate)
    .sort()
    .at(-1);

  const items = posts
    .map((post) => {
      const url = `${normalizedBaseUrl}/blog/${post.slug_pt}`;

      return `
    <item>
      <title>${cdata(post.title_pt)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${parseBlogDate(post.publicationDate).toUTCString()}</pubDate>
      <description>${cdata(post.summary_pt)}</description>
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(`${normalizedBaseUrl}/blog`)}</link>
    <description>${escapeXml(description)}</description>
    <language>pt-BR</language>${latestDate ? `
    <lastBuildDate>${parseBlogDate(latestDate).toUTCString()}</lastBuildDate>` : ""}
    <atom:link href="${escapeXml(`${normalizedBaseUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}

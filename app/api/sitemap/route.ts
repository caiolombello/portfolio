import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");

export async function GET() {
  try {
    let sitemapContent = "";
    try {
      sitemapContent = await fs.readFile(sitemapPath, "utf-8");
    } catch {
      // Se não encontrar o sitemap.xml, gerar um novo
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com";
      sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${baseUrl}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>${baseUrl}/about</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>${baseUrl}/projects</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>${baseUrl}/blog</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>${baseUrl}/contact</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`;
      await fs.writeFile(sitemapPath, sitemapContent, "utf-8");
    }
    return new NextResponse(sitemapContent, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar sitemap.xml:", error);
    return new NextResponse("Erro ao gerar sitemap.xml", { status: 500 });
  }
}

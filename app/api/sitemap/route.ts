import { NextResponse } from "next/server"
import { getBlob, saveToBlob } from "@/lib/blob-storage"

export async function GET() {
  try {
    const sitemapBlob = await getBlob("sitemap.xml")
    if (sitemapBlob) {
      return new NextResponse(sitemapBlob, {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      })
    }

    // Se não encontrar o sitemap.xml, gerar um novo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com"
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`

    // Salvar o sitemap no Blob Storage
    const result = await saveToBlob("sitemap.xml", sitemap)
    if (!result.success) {
      throw new Error(result.error)
    }

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Erro ao gerar sitemap.xml:", error)
    return new NextResponse("Erro ao gerar sitemap.xml", { status: 500 })
  }
} 
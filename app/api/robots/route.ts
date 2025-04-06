import { NextResponse } from "next/server"
import { getBlob } from "@/lib/blob-storage"

export async function GET() {
  try {
    const robotsBlob = await getBlob("robots.txt")
    if (robotsBlob) {
      const robotsContent = await robotsBlob.text()
      return new NextResponse(robotsContent, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      })
    }

    // Se não encontrar o robots.txt, gerar um novo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caiolombelllo.com"
    const robots = `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

# Crawl-delay
Crawl-delay: 10

# Host
Host: ${baseUrl}

# Allow specific bots
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-Instant
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-Instant
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /`

    // Salvar o robots.txt no Blob Storage
    await put("robots.txt", robots, {
      access: "public",
    })

    return new NextResponse(robots, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Erro ao gerar robots.txt:", error)
    return new NextResponse("Erro ao gerar robots.txt", { status: 500 })
  }
} 
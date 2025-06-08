import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const robotsPath = path.join(process.cwd(), "public", "robots.txt");

export async function GET() {
  try {
    let robotsContent = "";
    try {
      robotsContent = await fs.readFile(robotsPath, "utf-8");
    } catch {
      // Se não encontrar o robots.txt, gerar um novo
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com";
      robotsContent = `# Allow all crawlers\nUser-agent: *\nAllow: /\n\n# Sitemap\nSitemap: ${baseUrl}/sitemap.xml\n\n# Disallow API routes\nDisallow: /api/\nDisallow: /_next/\nDisallow: /static/\n\n# Crawl-delay\nCrawl-delay: 10\n\n# Host\nHost: ${baseUrl}\n`;
      await fs.writeFile(robotsPath, robotsContent, "utf-8");
    }
    return new NextResponse(robotsContent, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar robots.txt:", error);
    return new NextResponse("Erro ao gerar robots.txt", { status: 500 });
  }
}

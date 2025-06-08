import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/site-metadata";

export async function GET() {
  try {
    const config = getSiteConfig();
    
    // Criar o manifesto usando configuração dinâmica
    const manifest = {
      name: config.site.title,
      short_name: config.site.shortName,
      description: config.site.description,
      start_url: "/",
      display: "standalone",
      background_color: "#121212",
      theme_color: "#121212",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/api/favicon?size=192&format=png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/api/favicon?size=512&format=png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/api/favicon?size=180&format=png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/api/favicon?size=144&format=png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/api/favicon?size=96&format=png",
          sizes: "96x96",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/api/favicon?size=72&format=png",
          sizes: "72x72",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/api/favicon?size=48&format=png",
          sizes: "48x48",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/api/favicon?size=32&format=png",
          sizes: "32x32",
          type: "image/png",
          purpose: "any",
        },
      ],
      screenshots: [
        {
          src: "/images/screenshots/desktop.jpg",
          sizes: "1280x720",
          type: "image/jpeg",
          form_factor: "wide",
          label: "Desktop view of the portfolio",
        },
        {
          src: "/images/screenshots/mobile.jpg", 
          sizes: "390x844",
          type: "image/jpeg",
          form_factor: "narrow",
          label: "Mobile view of the portfolio",
        },
      ],
      categories: ["portfolio", "business", "productivity"],
      lang: "pt-BR",
      dir: "ltr",
    };

    return NextResponse.json(manifest, {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=86400", // Cache por 24 horas
      },
    });
  } catch (error) {
    console.error("Error generating manifest:", error);

    // Fallback para configuração padrão
    return NextResponse.json({
      name: "Portfolio Template",
      short_name: "Portfolio",
      description: "Professional portfolio and blog",
      start_url: "/",
      display: "standalone", 
      background_color: "#121212",
      theme_color: "#121212",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
  }
}

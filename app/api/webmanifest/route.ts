import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    // Obter o nome do perfil para o título do manifesto
    let name = "Caio Barbieri - DevOps Engineer";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Tentar obter dados do perfil
    try {
      // Verificar se o Blob Storage está configurado
      const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

      if (isBlobConfigured) {
        // Tentar carregar do Blob Storage
        const { blobs } = await list({ prefix: "portfolio-data/" });
        const profileBlob = blobs.find(
          (b) => b.pathname === "portfolio-data/profile.json",
        );

        if (profileBlob) {
          const response = await fetch(profileBlob.url);
          if (response.ok) {
            const profileData = await response.json();
            if (profileData.pt && profileData.pt.name) {
              name = `${profileData.pt.name} - ${profileData.pt.title.split("|")[0].trim()}`;
            }
          }
        }
      } else {
        // Tentar carregar do sistema de arquivos local
        const profilePath = path.join(
          process.cwd(),
          "public",
          "data",
          "profile.json",
        );
        const fileContent = await fs.readFile(profilePath, "utf-8");
        const profileData = JSON.parse(fileContent);

        if (profileData.pt && profileData.pt.name) {
          name = `${profileData.pt.name} - ${profileData.pt.title.split("|")[0].trim()}`;
        }
      }
    } catch (error) {
      console.error("Erro ao obter dados do perfil para o manifesto:", error);
      // Continuar com o nome padrão
    }

    // Criar o manifesto
    const manifest = {
      name: name,
      short_name: name.split(" - ")[0],
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
      theme_color: "#121212",
      background_color: "#121212",
      display: "standalone",
      start_url: "/",
    };

    return NextResponse.json(manifest);
  } catch (error) {
    console.error("Erro ao gerar manifesto:", error);

    // Em caso de erro, retornar um manifesto padrão
    return NextResponse.json({
      name: "Caio Barbieri - DevOps Engineer",
      short_name: "Caio Barbieri",
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
      theme_color: "#121212",
      background_color: "#121212",
      display: "standalone",
      start_url: "/",
    });
  }
}

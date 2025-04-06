import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    // Verificar se o Blob Storage está configurado
    const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

    // Tentar buscar do Blob Storage primeiro (se configurado)
    if (isBlobConfigured) {
      try {
        // Listar blobs para encontrar o ícone
        const { blobs } = await list({ prefix: "portfolio-images/" })

        // Procurar por um apple-touch-icon no storage
        const iconBlob = blobs.find(
          (b) => b.pathname.includes("apple-touch-icon") || b.pathname.includes("profile-apple-icon"),
        )

        if (iconBlob) {
          console.log(`Apple touch icon encontrado no Blob Storage: ${iconBlob.url}`)

          // Fazer fetch do blob
          const response = await fetch(iconBlob.url)

          if (response.ok) {
            const imageBuffer = await response.arrayBuffer()
            return new NextResponse(Buffer.from(imageBuffer), {
              headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=86400", // Cache por 24 horas
              },
            })
          }
        }

        // Se não encontrar um ícone específico, podemos usar a imagem de perfil
        const profileBlob = blobs.find(
          (b) =>
            b.pathname.includes("profile") &&
            (b.pathname.endsWith(".png") || b.pathname.endsWith(".jpg") || b.pathname.endsWith(".jpeg")),
        )

        if (profileBlob) {
          console.log(`Usando imagem de perfil como apple touch icon: ${profileBlob.url}`)

          // Fazer fetch do blob
          const response = await fetch(profileBlob.url)

          if (response.ok) {
            const imageBuffer = await response.arrayBuffer()
            return new NextResponse(Buffer.from(imageBuffer), {
              headers: {
                "Content-Type": response.headers.get("Content-Type") || "image/png",
                "Cache-Control": "public, max-age=86400", // Cache por 24 horas
              },
            })
          }
        }
      } catch (blobError) {
        console.error("Erro ao buscar apple-touch-icon do Blob Storage:", blobError)
      }
    }

    // Fallback para o arquivo local
    const iconPath = path.join(process.cwd(), "public", "apple-touch-icon.png")
    const icon = await fs.readFile(iconPath)

    return new NextResponse(icon, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // Cache por 24 horas
      },
    })
  } catch (error) {
    console.error("Erro ao servir apple-touch-icon:", error)
    return new NextResponse(null, { status: 404 })
  }
}


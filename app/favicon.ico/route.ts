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
        // Listar blobs para encontrar o favicon
        const { blobs } = await list({ prefix: "portfolio-images/" })

        // Procurar por um favicon no storage - podemos usar convenções de nomenclatura
        // como "favicon-32x32.png" ou "profile-favicon.png"
        const faviconBlob = blobs.find((b) => b.pathname.includes("favicon") || b.pathname.includes("profile-icon"))

        if (faviconBlob) {
          console.log(`Favicon encontrado no Blob Storage: ${faviconBlob.url}`)

          // Fazer fetch do blob
          const response = await fetch(faviconBlob.url)

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
      } catch (blobError) {
        console.error("Erro ao buscar favicon do Blob Storage:", blobError)
      }
    }

    // Fallback para o arquivo local
    const faviconPath = path.join(process.cwd(), "public", "favicon-32x32.png")
    const favicon = await fs.readFile(faviconPath)

    return new NextResponse(favicon, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // Cache por 24 horas
      },
    })
  } catch (error) {
    console.error("Erro ao servir favicon:", error)
    return new NextResponse(null, { status: 404 })
  }
}


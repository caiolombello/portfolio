import { NextResponse } from "next/server"
import sharp from "sharp"
import fs from "fs/promises"
import path from "path"
import { list } from "@vercel/blob"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const size = Number.parseInt(searchParams.get("size") || "32", 10)
    const format = searchParams.get("format") || "png"

    // Obter a URL da imagem de perfil
    let imageUrl = "/images/profile-ios.png" // Imagem padrão

    // Tentar obter a imagem do perfil do Blob Storage ou arquivo local
    try {
      // Verificar se o Blob Storage está configurado
      const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

      if (isBlobConfigured) {
        // Tentar carregar do Blob Storage
        const { blobs } = await list({ prefix: "portfolio-data/" })
        const profileBlob = blobs.find((b) => b.pathname === "portfolio-data/profile.json")

        if (profileBlob) {
          const response = await fetch(profileBlob.url)
          if (response.ok) {
            const profileData = await response.json()
            if (profileData.imageUrl) {
              imageUrl = profileData.imageUrl
            }
          }
        }
      } else {
        // Tentar carregar do sistema de arquivos local
        const profilePath = path.join(process.cwd(), "public", "data", "profile.json")
        const fileContent = await fs.readFile(profilePath, "utf-8")
        const profileData = JSON.parse(fileContent)

        if (profileData.imageUrl) {
          imageUrl = profileData.imageUrl
        }
      }
    } catch (error) {
      console.error("Erro ao obter imagem de perfil:", error)
      // Continuar com a imagem padrão
    }

    // Obter a imagem
    let imageBuffer: Buffer

    if (imageUrl.startsWith("http")) {
      // Imagem externa (Blob Storage ou outra URL)
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    } else {
      // Imagem local
      const imagePath = path.join(process.cwd(), "public", imageUrl)
      imageBuffer = await fs.readFile(imagePath)
    }

    // Processar a imagem com Sharp
    let processedImage: Buffer
    let contentType: string

    if (format === "ico") {
      // Para formato ICO, primeiro convertemos para PNG e depois para ICO
      processedImage = await sharp(imageBuffer).resize(size, size).toFormat("png").toBuffer()

      contentType = "image/x-icon"
    } else {
      // Para outros formatos (png por padrão)
      processedImage = await sharp(imageBuffer).resize(size, size).toFormat("png").toBuffer()

      contentType = "image/png"
    }

    // Retornar a imagem como resposta
    return new NextResponse(processedImage, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache por 24 horas
      },
    })
  } catch (error) {
    console.error("Erro ao gerar favicon:", error)

    // Em caso de erro, retornar um favicon padrão
    try {
      const defaultFaviconPath = path.join(process.cwd(), "public", "favicon-32x32.png")
      const defaultFavicon = await fs.readFile(defaultFaviconPath)

      return new NextResponse(defaultFavicon, {
        headers: {
          "Content-Type": "image/png",
        },
      })
    } catch (fallbackError) {
      // Se nem isso funcionar, retornar um erro
      return new NextResponse("Erro ao gerar favicon", { status: 500 })
    }
  }
}


import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { list } from "@vercel/blob"
import { defaultMetadata } from "@/types/metadata"

const metadataPath = path.join(process.cwd(), "public", "data", "metadata.json")
const BLOB_PREFIX = "portfolio-data/"

export async function GET() {
  console.log("API: Carregando metadados...")

  try {
    // Verificar se o Blob Storage está configurado
    const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

    // Tentar carregar do Blob Storage primeiro (se configurado)
    if (isBlobConfigured) {
      try {
        console.log("Tentando carregar metadados do Blob Storage...")

        // Listar blobs para encontrar os metadados
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        const metadataBlob = blobs.find((b) => b.pathname === `${BLOB_PREFIX}metadata.json`)

        if (metadataBlob) {
          console.log(`Blob de metadados encontrado: ${metadataBlob.url}`)

          // Fazer fetch do blob
          const response = await fetch(metadataBlob.url)

          if (response.ok) {
            const metadataData = await response.json()
            console.log("Metadados carregados com sucesso do Blob Storage")
            return NextResponse.json(metadataData)
          } else {
            console.error(`Erro ao fazer fetch do blob: ${response.status} ${response.statusText}`)
          }
        } else {
          console.log("Blob de metadados não encontrado")
        }
      } catch (blobError) {
        console.error("Erro ao carregar metadados do Blob Storage:", blobError)
      }
    }

    // Tentar carregar do sistema de arquivos local
    try {
      console.log("Tentando carregar metadados do sistema de arquivos local...")
      const fileContent = await fs.readFile(metadataPath, "utf-8")
      const metadataData = JSON.parse(fileContent)
      console.log("Metadados carregados com sucesso do sistema de arquivos local")
      return NextResponse.json(metadataData)
    } catch (fsError) {
      console.error("Erro ao carregar metadados do sistema de arquivos local:", fsError)
    }

    // Se tudo falhar, retornar os dados padrão
    console.log("Retornando dados padrão de metadados")
    return NextResponse.json(defaultMetadata)
  } catch (error) {
    console.error("Erro ao carregar metadados:", error)
    // Garantir que sempre retornamos um JSON válido
    return NextResponse.json(defaultMetadata)
  }
}


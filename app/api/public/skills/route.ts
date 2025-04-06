import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { list } from "@vercel/blob"

const skillsPath = path.join(process.cwd(), "public", "data", "skills.json")
const BLOB_PREFIX = "portfolio-data/"

// Dados padrão para habilidades
const defaultSkills = [
  { name: "Python & Golang", percentage: 90 },
  { name: "Kubernetes & Container Orchestration", percentage: 85 },
  { name: "CI/CD Pipeline Automation", percentage: 90 },
  { name: "Infrastructure as Code (IaC)", percentage: 85 },
  { name: "Cloud Native & AWS", percentage: 90 },
  { name: "Monitoring & Observability", percentage: 80 },
  { name: "Artificial Intelligence (AI)", percentage: 75 },
]

export async function GET() {
  console.log("API: Carregando skills...")

  try {
    // Verificar se o Blob Storage está configurado
    const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

    // Tentar carregar do Blob Storage primeiro (se configurado)
    if (isBlobConfigured) {
      try {
        console.log("Tentando carregar skills do Blob Storage...")

        // Listar blobs para encontrar as skills
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        const skillsBlob = blobs.find((b) => b.pathname === `${BLOB_PREFIX}skills.json`)

        if (skillsBlob) {
          console.log(`Blob de skills encontrado: ${skillsBlob.url}`)

          // Fazer fetch do blob
          const response = await fetch(skillsBlob.url)

          if (response.ok) {
            const skillsData = await response.json()
            console.log("Skills carregadas com sucesso do Blob Storage")
            return NextResponse.json(skillsData)
          } else {
            console.error(`Erro ao fazer fetch do blob: ${response.status} ${response.statusText}`)
          }
        } else {
          console.log("Blob de skills não encontrado")
        }
      } catch (blobError) {
        console.error("Erro ao carregar skills do Blob Storage:", blobError)
      }
    }

    // Tentar carregar do sistema de arquivos local
    try {
      console.log("Tentando carregar skills do sistema de arquivos local...")
      const fileContent = await fs.readFile(skillsPath, "utf-8")
      const skillsData = JSON.parse(fileContent)
      console.log("Skills carregadas com sucesso do sistema de arquivos local")
      return NextResponse.json(skillsData)
    } catch (fsError) {
      console.error("Erro ao carregar skills do sistema de arquivos local:", fsError)
    }

    // Se tudo falhar, retornar os dados padrão
    console.log("Retornando dados padrão de skills")
    return NextResponse.json(defaultSkills)
  } catch (error) {
    console.error("Erro ao carregar skills:", error)
    // Garantir que sempre retornamos um JSON válido
    return NextResponse.json(defaultSkills)
  }
}


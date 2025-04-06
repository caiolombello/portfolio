import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const certificationsPath = path.join(process.cwd(), "public", "data", "certifications.json")

// Dados padrão para certificações
const defaultCertifications = [
  "AWS Certified Cloud Practitioner",
  "HashiCorp Certified: Vault Associate",
  "Vault: Certified HashiCorp Implementation Partner (CHIP)",
  "AWS Knowledge: Amazon EKS",
  "Neo4j Fundamentals",
]

export async function GET() {
  try {
    // Tentar ler do sistema de arquivos local
    try {
      const fileContent = await fs.readFile(certificationsPath, "utf-8")
      const certificationsData = JSON.parse(fileContent)
      return NextResponse.json(certificationsData)
    } catch (fsError) {
      console.error("Erro ao ler arquivo de certificações local:", fsError)
      // Se não conseguir ler do sistema de arquivos, retorna os dados padrão
      return NextResponse.json(defaultCertifications)
    }
  } catch (error) {
    console.error("Erro ao carregar certificações:", error)
    // Garantir que sempre retornamos um JSON válido
    return NextResponse.json(defaultCertifications)
  }
}


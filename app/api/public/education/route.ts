import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const educationPath = path.join(process.cwd(), "public", "data", "education.json")

// Dados padrão para educação
const defaultEducation = {
  pt: [
    {
      degree: "Bacharelado em Sistemas de Informação",
      institution: "Estácio",
      period: "Mar 2022 - Jul 2025",
      description:
        "Formação abrangente em desenvolvimento de software, banco de dados, sistemas distribuídos e tecnologias modernas.",
    },
  ],
  en: [
    {
      degree: "Bachelor of Information Systems",
      institution: "Estácio",
      period: "Mar 2022 - Jul 2025",
      description:
        "Comprehensive education in software development, databases, distributed systems, and modern technologies.",
    },
  ],
}

export async function GET() {
  try {
    // Tentar ler do sistema de arquivos local
    try {
      const fileContent = await fs.readFile(educationPath, "utf-8")
      const educationData = JSON.parse(fileContent)
      return NextResponse.json(educationData)
    } catch (fsError) {
      console.error("Erro ao ler arquivo de educação local:", fsError)
      // Se não conseguir ler do sistema de arquivos, retorna os dados padrão
      return NextResponse.json(defaultEducation)
    }
  } catch (error) {
    console.error("Erro ao carregar educação:", error)
    // Garantir que sempre retornamos um JSON válido
    return NextResponse.json(defaultEducation)
  }
}


import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const experiencesPath = path.join(process.cwd(), "public", "data", "experiences.json")

// Dados padrão para experiências
const defaultExperiences = {
  pt: [
    {
      title: "DevOps Analyst Pleno",
      company: "Vertigo Tecnologia",
      period: "Set 2024 - Presente",
      responsibilities: [
        "Automação e Entregas: Desenvolvimento e implementação de soluções de automação de infraestrutura, pipelines CI/CD e práticas de DevOps para diversos clientes.",
        "Iniciativas com IA: Criação e implementação de ferramentas baseadas em IA para otimizar processos e operações.",
      ],
    },
  ],
  en: [
    {
      title: "DevOps Analyst Pleno",
      company: "Vertigo Tecnologia",
      period: "Sep 2024 - Present",
      responsibilities: [
        "Automation and Delivery: Development and implementation of infrastructure automation solutions, CI/CD pipelines, and DevOps practices for various clients.",
        "AI Initiatives: Creation and implementation of AI-based tools to optimize processes and operations.",
      ],
    },
  ],
}

export async function GET() {
  try {
    // Tentar ler do sistema de arquivos local
    try {
      const fileContent = await fs.readFile(experiencesPath, "utf-8")
      const experiencesData = JSON.parse(fileContent)
      return NextResponse.json(experiencesData)
    } catch (fsError) {
      console.error("Erro ao ler arquivo de experiências local:", fsError)
      // Se não conseguir ler do sistema de arquivos, retorna os dados padrão
      return NextResponse.json(defaultExperiences)
    }
  } catch (error) {
    console.error("Erro ao carregar experiências:", error)
    // Garantir que sempre retornamos um JSON válido
    return NextResponse.json(defaultExperiences)
  }
}


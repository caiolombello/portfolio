import { NextResponse } from "next/server"

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
  try {
    return NextResponse.json(defaultSkills)
  } catch (error) {
    console.error("Erro ao carregar habilidades:", error)
    return NextResponse.json(defaultSkills)
  }
}

export async function POST(request: Request) {
  try {
    const skillsData = await request.json()

    // Validar dados (implementação básica)
    if (!Array.isArray(skillsData)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no sistema de armazenamento (Blob Storage ou arquivo local)
    const result = await saveToBlob("skills", skillsData)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Erro ao salvar as habilidades",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar habilidades:", error)
    return NextResponse.json(
      {
        error: "Erro ao salvar dados de habilidades",
      },
      { status: 500 },
    )
  }
}


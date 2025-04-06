import { NextResponse } from "next/server"
import { loadFromBlob } from "@/lib/blob-storage"
import type { Skill } from "@/types/skill"

// Dados padrão para as skills
const defaultSkills: Skill[] = [
  {
    id: "1",
    name: "JavaScript",
    level: 90,
    category: "Frontend",
  },
  {
    id: "2",
    name: "React",
    level: 85,
    category: "Frontend",
  },
  {
    id: "3",
    name: "Node.js",
    level: 80,
    category: "Backend",
  },
  {
    id: "4",
    name: "TypeScript",
    level: 75,
    category: "Frontend",
  },
  {
    id: "5",
    name: "Next.js",
    level: 70,
    category: "Frontend",
  },
]

export async function GET() {
  console.log("API: Carregando skills...")

  try {
    // Tentar carregar as skills do armazenamento
    const skills = await loadFromBlob<Skill[]>("skills", defaultSkills)

    console.log("API: Skills carregadas com sucesso:", skills)

    return NextResponse.json(skills)
  } catch (error) {
    console.error("API: Erro ao carregar skills:", error)

    // Em caso de erro, retornar os dados padrão
    return NextResponse.json(defaultSkills, { status: 200 })
  }
}


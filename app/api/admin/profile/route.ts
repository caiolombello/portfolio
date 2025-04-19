import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

const profilePath = path.join(process.cwd(), "public", "data", "profile.json")

// Dados padrão para o perfil
const defaultProfile = {
  pt: {
    name: "Caio Lombello Vendramini Barbieri",
    title: "Engenheiro DevOps | Cloud Native | Kubernetes | IA para DevOps",
    email: "caio@lombello.com",
    phone: "+55 (19) 99753-6692",
    location: "Campinas, São Paulo, Brasil",
    birthDate: "16 de dezembro de 2002",
    about:
      "Engenheiro DevOps com expertise em Cloud Native, Observabilidade, automação de infraestrutura e CI/CD. Experiência sólida na criação de pipelines GitOps e DevSecOps, além da integração de Inteligência Artificial em operações. Habilidade avançada em Python, Golang e Kubernetes, entregando soluções seguras, escaláveis e de alta performance. Focado em inovação e eficiência operacional.",
  },
  en: {
    name: "Caio Lombello Vendramini Barbieri",
    title: "DevOps Engineer | Cloud Native | Kubernetes | AI for DevOps",
    email: "caio@lombello.com",
    phone: "+55 (19) 99753-6692",
    location: "Campinas, São Paulo, Brazil",
    birthDate: "December 16, 2002",
    about:
      "DevOps Engineer with expertise in Cloud Native, Observability, infrastructure automation, and CI/CD. Solid experience in creating GitOps and DevSecOps pipelines, as well as integrating Artificial Intelligence into operations. Advanced skills in Python, Golang, and Kubernetes, delivering secure, scalable, and high-performance solutions. Focused on innovation and operational efficiency.",
  },
  socialLinks: {
    github: "https://github.com/caiolombello",
    linkedin: "https://linkedin.com/in/caiolvbarbieri",
    twitter: "https://twitter.com/caiolombello",
    instagram: "https://instagram.com/caiolombello",
    website: "https://caio.lombello.com",
  },
}

export async function GET() {
  try {
    let profile = defaultProfile
    try {
      const file = await fs.readFile(profilePath, "utf-8")
      profile = JSON.parse(file)
    } catch {}
    return NextResponse.json(profile)
  } catch (error) {
    console.error("Erro ao carregar perfil:", error)
    return NextResponse.json(defaultProfile)
  }
}

export async function POST(request: Request) {
  try {
    const profileData = await request.json()
    await fs.writeFile(profilePath, JSON.stringify(profileData, null, 2), "utf-8")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar perfil:", error)
    return NextResponse.json({ error: "Erro ao salvar perfil" }, { status: 500 })
  }
}


import { NextResponse } from "next/server"
import path from "path"
import { saveToBlob, loadFromBlob } from "@/lib/blob-storage"

const profilePath = path.join(process.cwd(), "public", "data", "profile.json")

// Dados padrão para o perfil
const defaultProfile = {
  pt: {
    name: "Caio Lombello Vendramini Barbieri",
    title: "Engenheiro DevOps Pleno | Cloud Native | Kubernetes | IA para DevOps",
    email: "caio@lombello.com",
    phone: "+55 (19) 99753-6692",
    location: "Campinas, São Paulo, Brasil",
    birthDate: "16 de dezembro de 2002",
    about:
      "Engenheiro DevOps Pleno com expertise em Cloud Native, Observabilidade, automação de infraestrutura e CI/CD. Experiência sólida na criação de pipelines GitOps e DevSecOps, além da integração de Inteligência Artificial em operações. Habilidade avançada em Python, Golang e Kubernetes, entregando soluções seguras, escaláveis e de alta performance. Focado em inovação e eficiência operacional.",
  },
  en: {
    name: "Caio Lombello Vendramini Barbieri",
    title: "Senior DevOps Engineer | Cloud Native | Kubernetes | AI for DevOps",
    email: "caio@lombello.com",
    phone: "+55 (19) 99753-6692",
    location: "Campinas, São Paulo, Brazil",
    birthDate: "December 16, 2002",
    about:
      "Senior DevOps Engineer with expertise in Cloud Native, Observability, infrastructure automation, and CI/CD. Solid experience in creating GitOps and DevSecOps pipelines, as well as integrating Artificial Intelligence into operations. Advanced skills in Python, Golang, and Kubernetes, delivering secure, scalable, and high-performance solutions. Focused on innovation and operational efficiency.",
  },
  socialLinks: {
    github: "https://github.com/caiolomba",
    linkedin: "https://linkedin.com/in/caiolomba",
    twitter: "https://twitter.com/caiolomba",
    instagram: "https://instagram.com/caiolomba",
    website: "https://lombello.com",
  },
}

export async function GET() {
  try {
    // Carregar do sistema de armazenamento (Blob Storage ou arquivo local)
    const profileData = await loadFromBlob("profile", defaultProfile)
    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Erro ao carregar perfil:", error)
    return NextResponse.json(defaultProfile)
  }
}

export async function POST(request: Request) {
  try {
    const profileData = await request.json()

    // Validar dados (implementação básica)
    if (!profileData.pt || !profileData.en) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no sistema de armazenamento (Blob Storage ou arquivo local)
    const result = await saveToBlob("profile", profileData)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Erro ao salvar os dados do perfil",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar perfil:", error)
    return NextResponse.json(
      {
        error: "Erro ao salvar dados do perfil",
      },
      { status: 500 },
    )
  }
}


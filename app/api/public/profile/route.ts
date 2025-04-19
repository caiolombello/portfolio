import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { list } from "@vercel/blob"

const profilePath = path.join(process.cwd(), "public", "data", "profile.json")
const BLOB_PREFIX = "portfolio-data/"

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
  imageUrl: "/images/profile-ios.png", // Imagem padrão
  socialLinks: {
    github: "https://github.com/caiolomba",
    linkedin: "https://linkedin.com/in/caiolomba",
    twitter: "https://twitter.com/caiolomba",
    instagram: "https://instagram.com/caiolomba",
    website: "https://lombello.com",
    whatsapp: "https://wa.me/5519997536692"
  }
}

export async function GET() {
  console.log("API: Carregando perfil...")

  try {
    // Verificar se o Blob Storage está configurado
    const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

    // Tentar carregar do Blob Storage primeiro (se configurado)
    if (isBlobConfigured) {
      try {
        console.log("Tentando carregar perfil do Blob Storage...")

        // Listar blobs para encontrar o perfil
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        const profileBlob = blobs.find((b) => b.pathname === `${BLOB_PREFIX}profile.json`)

        if (profileBlob) {
          console.log(`Blob de perfil encontrado: ${profileBlob.url}`)

          // Fazer fetch do blob
          const response = await fetch(profileBlob.url)

          if (response.ok) {
            const profileData = await response.json()
            console.log("Perfil carregado com sucesso do Blob Storage")
            return NextResponse.json(profileData)
          } else {
            console.error(`Erro ao fazer fetch do blob: ${response.status} ${response.statusText}`)
          }
        } else {
          console.log("Blob de perfil não encontrado")
        }
      } catch (blobError) {
        console.error("Erro ao carregar perfil do Blob Storage:", blobError)
      }
    }

    // Tentar carregar do sistema de arquivos local
    try {
      console.log("Tentando carregar perfil do sistema de arquivos local...")
      const fileContent = await fs.readFile(profilePath, "utf-8")
      const profileData = JSON.parse(fileContent)
      console.log("Perfil carregado com sucesso do sistema de arquivos local")
      return NextResponse.json(profileData)
    } catch (fsError) {
      console.error("Erro ao carregar perfil do sistema de arquivos local:", fsError)
    }

    // Se tudo falhar, retornar os dados padrão
    console.log("Retornando dados padrão de perfil")
    return NextResponse.json(defaultProfile)
  } catch (error) {
    console.error("Erro ao carregar perfil:", error)
    // Garantir que sempre retornamos um JSON válido
    return NextResponse.json(defaultProfile)
  }
}


import { loadFromBlob } from "./blob-storage"

export interface Profile {
  name: string
  title: string
  bio: string
  email: string
  location: string
  avatar: string
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
    instagram?: string
    website?: string
  }
}

export interface Skill {
  name: string
  level: number
  category: string
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  technologies: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  description: string
}

export interface Certification {
  name: string
  issuer: string
  date: string
  description: string
  url?: string
}

export async function getProfile(): Promise<Profile | null> {
  try {
    console.log("Tentando carregar profile...")

    // Definir dados padrão para o perfil
    const defaultProfile: Profile = {
      name: "Portfolio",
      title: "Desenvolvedor Web",
      bio: "Desenvolvedor web apaixonado por criar experiências digitais incríveis.",
      email: "contato@exemplo.com",
      location: "Brasil",
      avatar: "/placeholder.svg?height=200&width=200",
      socialLinks: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        twitter: "https://twitter.com",
      },
    }

    // Carregar do Blob Storage ou sistema de arquivos local com fallback para dados padrão
    const profile = await loadFromBlob<Profile>("profile.json", defaultProfile)
    return profile
  } catch (error) {
    console.error("Erro ao carregar profile:", error)
    return null
  }
}

// Outras funções de dados permanecem inalteradas...


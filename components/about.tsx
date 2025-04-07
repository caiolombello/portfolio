"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { EnvelopeIcon, PhoneIcon, ChatBubbleLeftRightIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import SkillBar from "./skill-bar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProfileData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  birthDate: string
  about: string
}

interface ProfileState {
  pt: ProfileData
  en: ProfileData
  imageUrl?: string
}

interface Skill {
  name: string
  percentage: number
}

export default function About() {
  const { t, language } = useLanguage()
  const [profile, setProfile] = useState<ProfileState | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Carregar perfil
        const profileResponse = await fetch("/api/public/profile")

        if (!profileResponse.ok) {
          throw new Error(`Erro ao carregar perfil: ${profileResponse.status} ${profileResponse.statusText}`)
        }

        const profileData = await profileResponse.json()
        setProfile(profileData)

        // Carregar habilidades
        const skillsResponse = await fetch("/api/public/skills")

        if (!skillsResponse.ok) {
          throw new Error(`Erro ao carregar habilidades: ${skillsResponse.status} ${skillsResponse.statusText}`)
        }

        const skillsData = await skillsResponse.json()
        setSkills(skillsData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Dados padrão para fallback em caso de erro
  const defaultProfile: ProfileState = {
    pt: {
      name: "Caio Lombello Vendramini Barbieri",
      title: "Engenheiro DevOps Pleno | Cloud Native | Kubernetes | IA para DevOps",
      email: "caio@lombello.com",
      phone: "+55 (19) 99753-6692",
      location: "Campinas, São Paulo, Brasil",
      birthDate: "16 de dezembro de 2002",
      about:
        "Engenheiro DevOps Pleno com expertise em Cloud Native, Observabilidade, automação de infraestrutura e CI/CD.",
    },
    en: {
      name: "Caio Lombello Vendramini Barbieri",
      title: "Senior DevOps Engineer | Cloud Native | Kubernetes | AI for DevOps",
      email: "caio@lombello.com",
      phone: "+55 (19) 99753-6692",
      location: "Campinas, São Paulo, Brazil",
      birthDate: "December 16, 2002",
      about:
        "Senior DevOps Engineer with expertise in Cloud Native, Observability, infrastructure automation, and CI/CD.",
    },
    imageUrl: "/images/profile-ios.png", // Imagem padrão
  }

  const defaultSkills: Skill[] = [
    { name: "Python & Golang", percentage: 90 },
    { name: "Kubernetes", percentage: 85 },
    { name: "CI/CD Automation", percentage: 90 },
  ]

  // Usar dados padrão se houver erro ou estiver carregando
  const currentProfile: ProfileData = (profile
    ? profile[language as keyof ProfileState]
    : defaultProfile[language as keyof ProfileState]) as ProfileData
  const currentSkills = skills.length > 0 ? skills : defaultSkills

  // Obter a URL da imagem do perfil
  const profileImageUrl = profile?.imageUrl || defaultProfile.imageUrl

  if (loading) {
    return (
      <section className="container py-12 md:py-16">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-secondary h-48 w-48"></div>
            <div className="h-4 bg-secondary rounded w-48 mt-6"></div>
            <div className="h-3 bg-secondary rounded w-32 mt-4"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!currentProfile) {
    return (
      <section className="container py-12 md:py-16">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>Não foi possível carregar o perfil.</AlertDescription>
        </Alert>
      </section>
    )
  }

  return (
    <section className="container py-12 md:py-16">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>{error}. Exibindo informações padrão.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Coluna Esquerda - Informações Pessoais */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="relative mb-6 h-48 w-48 sm:h-64 sm:w-64 overflow-hidden rounded-full border-4 border-gold shadow-lg shadow-gold/10 transition-transform duration-500 hover:scale-105">
            <Image
              src={profileImageUrl || "/placeholder.svg"}
              alt={currentProfile.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gold md:text-4xl">{currentProfile.name}</h1>

          <h2 className="mb-6 text-xl text-muted-foreground">{currentProfile.title}</h2>

          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-gold" />
              <Link
                href={`mailto:${currentProfile.email}`}
                className="text-foreground hover:text-gold transition-colors"
              >
                {currentProfile.email}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gold" />
              <Link href={`tel:${currentProfile.phone}`} className="text-foreground hover:text-gold transition-colors">
                {currentProfile.phone}
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button asChild className="gap-2">
              <Link href="https://wa.me/5519997536692" target="_blank" rel="noopener noreferrer">
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                WhatsApp
              </Link>
            </Button>

            <Button asChild>
              <Link href="https://fantastical.app/caiolvbarbieri" target="_blank" rel="noopener noreferrer">
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                {t("scheduleAMeeting")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Coluna Direita - Sobre e Habilidades */}
        <div className="flex flex-col">
          <h2 className="mb-4 text-2xl font-bold text-gold">{t("about")}</h2>

          <p className="mb-8 text-muted-foreground">{currentProfile.about}</p>

          <h2 className="mb-6 text-2xl font-bold text-gold">{t("mainSkills")}</h2>

          <div className="space-y-4">
            {currentSkills.map((skill) => (
              <SkillBar key={skill.name} skillName={skill.name} percentage={skill.percentage} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


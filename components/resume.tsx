"use client"

import { useState, useEffect } from "react"
import SkillBar from "./skill-bar"
import SectionHeading from "./section-heading"
import ExperienceItem from "./experience-item"
import EducationItem from "./education-item"
import ResumeDownload from "./resume-download"
import { useLanguage } from "@/contexts/language-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import SkillsList from "./skill-bar"
import CredlyCertifications from "./credly-certifications"

export default function Resume() {
  const { t, language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [experiences, setExperiences] = useState<any[]>([])
  const [educations, setEducations] = useState<any[]>([])
  const [certifications, setCertifications] = useState<string[]>([])
  const [skills, setSkills] = useState<any[]>([])

  // Dados padrão para fallback
  const defaultExperiences = [
    {
      title: "DevOps Analyst Pleno",
      company: "Vertigo Tecnologia",
      period: language === "pt" ? "Set 2024 - Presente" : "Sep 2024 - Present",
      responsibilities: [
        language === "pt"
          ? "Automação e Entregas: Desenvolvimento e implementação de soluções de automação de infraestrutura"
          : "Automation and Delivery: Development and implementation of infrastructure automation solutions",
      ],
    },
  ]

  const defaultEducations = [
    {
      degree: language === "pt" ? "Bacharelado em Sistemas de Informação" : "Bachelor of Information Systems",
      institution: "Estácio",
      period: "Mar 2022 - Jul 2025",
      description:
        language === "pt"
          ? "Formação abrangente em desenvolvimento de software, banco de dados, sistemas distribuídos e tecnologias modernas."
          : "Comprehensive education in software development, databases, distributed systems, and modern technologies.",
    },
  ]

  const defaultCertifications = ["AWS Certified Cloud Practitioner", "HashiCorp Certified: Vault Associate"]

  const defaultSkills = [
    { name: "Python & Golang", percentage: 90 },
    { name: "Kubernetes & Container Orchestration", percentage: 85 },
    { name: "CI/CD Pipeline Automation", percentage: 90 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Carregar experiências
        try {
          const experiencesResponse = await fetch("/api/public/experiences")
          if (!experiencesResponse.ok) {
            throw new Error(`Erro ao carregar experiências: ${experiencesResponse.status}`)
          }
          const experiencesData = await experiencesResponse.json()
          setExperiences(experiencesData[language] || [])
        } catch (expError) {
          console.error("Erro ao carregar experiências:", expError)
          setExperiences(defaultExperiences)
          setError(expError instanceof Error ? expError.message : "Erro ao carregar experiências")
        }

        // Carregar educação
        try {
          const educationResponse = await fetch("/api/public/education")
          if (!educationResponse.ok) {
            throw new Error(`Erro ao carregar educação: ${educationResponse.status}`)
          }
          const educationData = await educationResponse.json()
          setEducations(educationData[language] || [])
        } catch (eduError) {
          console.error("Erro ao carregar educação:", eduError)
          setEducations(defaultEducations)
          if (!error) setError(eduError instanceof Error ? eduError.message : "Erro ao carregar educação")
        }

        // Carregar certificações
        try {
          const certificationsResponse = await fetch("/api/public/certifications")
          if (!certificationsResponse.ok) {
            throw new Error(`Erro ao carregar certificações: ${certificationsResponse.status}`)
          }
          const certificationsData = await certificationsResponse.json()
          setCertifications(certificationsData || [])
        } catch (certError) {
          console.error("Erro ao carregar certificações:", certError)
          setCertifications(defaultCertifications)
          if (!error) setError(certError instanceof Error ? certError.message : "Erro ao carregar certificações")
        }

        // Carregar habilidades
        try {
          const skillsResponse = await fetch("/api/public/skills")
          if (!skillsResponse.ok) {
            throw new Error(`Erro ao carregar habilidades: ${skillsResponse.status}`)
          }
          const skillsData = await skillsResponse.json()
          setSkills(skillsData || [])
        } catch (skillsError) {
          console.error("Erro ao carregar habilidades:", skillsError)
          setSkills(defaultSkills)
          if (!error) setError(skillsError instanceof Error ? skillsError.message : "Erro ao carregar habilidades")
        }
      } catch (generalError) {
        console.error("Erro geral ao carregar dados:", generalError)
        if (!error) setError(generalError instanceof Error ? generalError.message : "Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [language, error])

  // Sanitize experiences to avoid rendering objects with {summary, entities}
  const normalizedExperiences = (experiences.length > 0 ? experiences : defaultExperiences).map(exp => {
    if (exp && typeof exp === "object" && "summary" in exp && "entities" in exp) {
      return {
        title: exp.summary,
        company: "",
        period: "",
        responsibilities: Array.isArray(exp.entities) ? exp.entities : [],
      }
    }
    return exp
  })

  // Dados do currículo para o componente de download
  const resumeData = {
    personalInfo: {
      name: t("name"),
      title: t("resume.title"),
      email: "caio@lombello.com",
      phone: "+55 (19) 99753-6692",
      location: language === "pt" ? "Campinas, São Paulo, Brasil" : "Campinas, São Paulo, Brazil",
    },
    summary: t("resume.aboutDescription"),
    experiences: normalizedExperiences.map(exp => ({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      responsibilities: exp.responsibilities
    })),
    education: educations.length > 0 ? educations : defaultEducations,
    certifications: certifications.length > 0 ? certifications : defaultCertifications,
    skills: skills.length > 0 ? skills : defaultSkills,
  }

  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[50vh]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="container py-12">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>{error}. Exibindo informações padrão.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gold text-center md:text-left mb-4 md:mb-0">
          {language === "pt" ? "Jornada Profissional" : "Professional Journey"}
        </h1>
        <ResumeDownload resumeData={resumeData} />
      </div>

      {/* Seção de Educação */}
      <section className="mb-16">
        <SectionHeading title={language === "pt" ? "Educação" : "Education"} />

        <div className="space-y-6">
          {(educations.length > 0 ? educations : defaultEducations).map((education, index) => (
            <EducationItem
              key={index}
              degree={education.degree}
              institution={education.institution}
              period={education.period}
              description={education.description}
            />
          ))}
        </div>
      </section>

      {/* Seção de Experiência */}
      <section className="mb-16">
        <SectionHeading title={language === "pt" ? "Experiência" : "Experience"} />

        <div className="space-y-6">
          {normalizedExperiences.map((experience, index) => (
            <ExperienceItem
              key={index}
              title={experience.title}
              company={experience.company}
              period={experience.period}
              responsibilities={experience.responsibilities}
            />
          ))}
        </div>
      </section>

      {/* Seção de Certificações */}
      <section className="mb-16">
        <SectionHeading title={language === "pt" ? "Certificações" : "Certifications"} />
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <CredlyCertifications />
        </div>
      </section>

      {/* Seção de Habilidades */}
      <section>
        <SectionHeading title={language === "pt" ? "Habilidades" : "Skills"} />
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <SkillsList />
        </div>
      </section>
    </div>
  )
}


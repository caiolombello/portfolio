"use client"

import { useState, useEffect } from "react"
import { getDictionary } from "@/app/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface ResumeContentProps {
  lang: string
}

export default function ResumeContent({ lang }: ResumeContentProps) {
  const [dict, setDict] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDictionary = async () => {
      setLoading(true)
      try {
        const dictionary = await getDictionary(lang)
        setDict(dictionary)
      } catch (error) {
        console.error("Failed to load dictionary:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDictionary()
  }, [lang])

  if (loading || !dict) return <div className="py-8 text-center">Loading...</div>

  // Dados reais do currículo
  const experiences = [
    {
      company: "Vertigo Tecnologia",
      position: "DevOps Analyst Pleno",
      period: `Set 2024 - ${lang === "en" ? "Present" : lang === "pt" ? "Presente" : "Presente"}`,
      description: `• Automação e Entregas: Desenvolvimento e implementação de soluções de automação de infraestrutura, pipelines CI/CD e práticas de DevOps para diversos clientes.
• Iniciativas com IA: Criação e implementação de ferramentas baseadas em IA para otimizar processos e operações.
• Engenharia de Plataforma (VeeCode Platform): Contribuição para configuração e otimização da plataforma, desenvolvendo templates, plugins e customizações.
• Implementação de soluções de observabilidade para garantir monitoramento eficaz e diagnóstico rápido de problemas.
• Consultoria DevOps: Suporte contínuo aos clientes, liderando a adoção de práticas de DevOps e promovendo a transformação digital.`,
    },
    {
      company: "Vertigo Tecnologia",
      position: "Analista DevOps Júnior",
      period: "Out 2022 - Set 2024",
      description: `• Transformação Cultural Cloud Native: Liderança em iniciativas de diagnóstico e transformação cultural, promovendo práticas Cloud Native.
• Desenvolvimento de Pipelines GitOps e DevSecOps: Implementação de pipelines automatizados para aplicações NodeJS, utilizando Bamboo (YAML) e scripts Shell.
• Monitoramento e Alertas: Implementação de soluções de monitoramento com Grafana, Prometheus, Loki e Alertmanager.
• Gestão de Serviços de Mensageria e Cache: Administração de serviços como Redis e RabbitMQ.
• Automação de Deployments com Helm e Docker: Criação de Helm Charts e Dockerfiles customizados para simplificar e automatizar deployments.
• Automações com Terraform: Desenvolvimento e manutenção de automações com Terraform para AWS, Helm e Kubernetes.
• Segurança e Conformidade em AWS: Implementação do princípio de menor privilégio nas configurações AWS.`,
    },
    {
      company: "Vertigo Tecnologia",
      position: "Estagiário DevOps",
      period: "Fev 2022 - Out 2022",
      description: `• Implementação de GitLab em Cluster DigitalOcean: Provisão do GitLab utilizando Helm e Kubernetes.
• Migração de Repositórios com Automação: Migração de mais de 200 repositórios do GitLab.com para o ambiente corporativo utilizando Python e a API do GitLab.
• Otimização de Performance com Helm: Personalização de templates Helm para o GitLab, resultando em melhorias significativas de performance.
• Desenvolvimento de Pipelines de CI/CD: Criação e implementação de pipelines para diversas aplicações, facilitando integrações e entregas contínuas.`,
    },
  ]

  const education = [
    {
      institution: "Estácio",
      degree: "Bacharelado em Sistemas de Informação",
      period: "Mar 2022 - Jul 2025",
      description:
        "Formação abrangente em desenvolvimento de software, banco de dados, sistemas distribuídos e tecnologias modernas.",
    },
  ]

  const skills = {
    technical: [
      "AWS",
      "Kubernetes",
      "Docker",
      "Terraform",
      "Helm",
      "CI/CD",
      "GitOps",
      "DevSecOps",
      "Observability",
      "Grafana",
      "Prometheus",
      "Loki",
      "Alertmanager",
      "Redis",
      "RabbitMQ",
      "Python",
      "Shell Scripting",
      "Node.js",
      "Git",
      "GitLab",
      "Neo4j",
    ],
    soft: [
      "Liderança",
      "Comunicação",
      "Trabalho em Equipe",
      "Resolução de Problemas",
      "Adaptabilidade",
      "Consultoria",
      "Transformação Cultural",
    ],
  }

  const certifications = [
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "2023" },
    { name: "HashiCorp Certified: Vault Associate", issuer: "HashiCorp", date: "2023" },
    { name: "Vault: Certified HashiCorp Implementation Partner (CHIP)", issuer: "HashiCorp", date: "2023" },
    { name: "AWS Knowledge: Amazon EKS", issuer: "Amazon Web Services", date: "2023" },
    { name: "Neo4j Fundamentals", issuer: "Neo4j", date: "2022" },
    { name: "Graph Data Modeling Fundamentals", issuer: "Neo4j", date: "2022" },
    { name: "Cypher Fundamentals", issuer: "Neo4j", date: "2022" },
    { name: "Importing CSV data into Neo4j", issuer: "Neo4j", date: "2022" },
    { name: "Introduction to Cybersecurity", issuer: "Cisco", date: "2022" },
  ]

  const languages = [
    { language: "Português", proficiency: "Nativo" },
    { language: "Inglês", proficiency: "Avançado" },
    { language: "Espanhol", proficiency: "Básico" },
  ]

  // Verificar se as traduções existem e usar fallbacks se necessário
  const title = dict.resume?.professionalJourney || "Jornada Profissional"
  const downloadText = dict.resume?.downloadResume || "Baixar Currículo"
  const experienceTitle = dict.resume?.experience?.title || "Experiência"
  const educationTitle = dict.resume?.education?.title || "Educação"
  const skillsTitle = dict.resume?.skills?.title || "Habilidades"
  const technicalSkillsTitle = dict.resume?.skills?.technical || "Habilidades Técnicas"
  const softSkillsTitle = dict.resume?.skills?.soft || "Habilidades Interpessoais"
  const certificationsTitle = dict.resume?.certifications?.title || "Certificações"
  const languagesTitle = dict.resume?.languages?.title || "Idiomas"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button variant="outline" className="flex items-center gap-2 hover:text-yellow-500">
          <Download size={16} />
          {downloadText}
        </Button>
      </div>

      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="experience">{experienceTitle}</TabsTrigger>
          <TabsTrigger value="education">{educationTitle}</TabsTrigger>
          <TabsTrigger value="skills">{skillsTitle}</TabsTrigger>
          <TabsTrigger value="certifications">{certificationsTitle}</TabsTrigger>
          <TabsTrigger value="languages">{languagesTitle}</TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="space-y-4">
          {experiences.map((exp, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{exp.position}</CardTitle>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <Badge variant="outline">{exp.period}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          {education.map((edu, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{edu.degree}</CardTitle>
                    <p className="text-muted-foreground">{edu.institution}</p>
                  </div>
                  <Badge variant="outline">{edu.period}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>{edu.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>{technicalSkillsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.technical.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{softSkillsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.soft.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>{certificationsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                    <Badge variant="outline">{cert.date}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages">
          <Card>
            <CardHeader>
              <CardTitle>{languagesTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="font-medium">{lang.language}</span>
                    <Badge variant="outline">{lang.proficiency}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


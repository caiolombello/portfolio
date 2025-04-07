import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface Skill {
  name: string;
  percentage: number;
}

interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  about: string;
}

interface ProfileData {
  pt: Profile;
}

interface ExperienceData {
  pt: Experience[];
}

interface EducationData {
  pt: Education[];
}

// Função para gerar o markdown do currículo (similar à função no componente ResumeDownload)
async function generateResumeMarkdown() {
  try {
    // Carregar dados necessários
    const profilePath = path.join(process.cwd(), "public", "data", "profile.json")
    const experiencesPath = path.join(process.cwd(), "public", "data", "experiences.json")
    const educationPath = path.join(process.cwd(), "public", "data", "education.json")
    const certificationsPath = path.join(process.cwd(), "public", "data", "certifications.json")
    const skillsPath = path.join(process.cwd(), "public", "data", "skills.json")

    const profileData = JSON.parse(await fs.readFile(profilePath, "utf-8")) as ProfileData
    const experiencesData = JSON.parse(await fs.readFile(experiencesPath, "utf-8")) as ExperienceData
    const educationData = JSON.parse(await fs.readFile(educationPath, "utf-8")) as EducationData
    const certificationsData = JSON.parse(await fs.readFile(certificationsPath, "utf-8")) as string[]
    const skillsData = JSON.parse(await fs.readFile(skillsPath, "utf-8")) as Skill[]

    // Usar os dados em português por padrão
    const profile = profileData.pt
    const experiences = experiencesData.pt
    const education = educationData.pt

    // Gerar o markdown do currículo
    let markdown = `# ${profile.name}

**${profile.title}**

Email: ${profile.email} | Telefone: ${profile.phone} | Localização: ${profile.location}

## Sobre Mim

${profile.about}

## Experiência

`

    experiences.forEach((exp: Experience) => {
      markdown += `### ${exp.title}
**${exp.company}** | ${exp.period}

`
      exp.responsibilities.forEach((resp: string) => {
        markdown += `- ${resp}
`
      })
      markdown += "\n"
    })

    markdown += `## Educação

`

    education.forEach((edu: Education) => {
      markdown += `### ${edu.degree}
**${edu.institution}** | ${edu.period}

${edu.description}

`
    })

    markdown += `## Certificações

`

    certificationsData.forEach((cert: string) => {
      markdown += `- ${cert}
`
    })
    markdown += "\n"

    markdown += `## Habilidades

`

    skillsData.forEach((skill: Skill) => {
      markdown += `- ${skill.name}: ${skill.percentage}%
`
    })

    return markdown
  } catch (error) {
    console.error("Erro ao gerar markdown do currículo:", error)
    return "# Erro ao gerar currículo\n\nOcorreu um erro ao gerar o conteúdo do currículo."
  }
}

export async function GET() {
  const content = await generateResumeMarkdown()

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}


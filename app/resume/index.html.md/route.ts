import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

// Função para gerar o markdown do currículo (similar à função no componente ResumeDownload)
async function generateResumeMarkdown() {
  try {
    // Carregar dados necessários
    const profilePath = path.join(process.cwd(), "public", "data", "profile.json")
    const experiencesPath = path.join(process.cwd(), "public", "data", "experiences.json")
    const educationPath = path.join(process.cwd(), "public", "data", "education.json")
    const certificationsPath = path.join(process.cwd(), "public", "data", "certifications.json")
    const skillsPath = path.join(process.cwd(), "public", "data", "skills.json")

    const profileData = JSON.parse(await fs.readFile(profilePath, "utf-8"))
    const experiencesData = JSON.parse(await fs.readFile(experiencesPath, "utf-8"))
    const educationData = JSON.parse(await fs.readFile(educationPath, "utf-8"))
    const certificationsData = JSON.parse(await fs.readFile(certificationsPath, "utf-8"))
    const skillsData = JSON.parse(await fs.readFile(skillsPath, "utf-8"))

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

    experiences.forEach((exp) => {
      markdown += `### ${exp.title}
**${exp.company}** | ${exp.period}

`
      exp.responsibilities.forEach((resp) => {
        markdown += `- ${resp}
`
      })
      markdown += "\n"
    })

    markdown += `## Educação

`

    education.forEach((edu) => {
      markdown += `### ${edu.degree}
**${edu.institution}** | ${edu.period}

${edu.description}

`
    })

    markdown += `## Certificações

`

    certificationsData.forEach((cert) => {
      markdown += `- ${cert}
`
    })
    markdown += "\n"

    markdown += `## Habilidades

`

    skillsData.forEach((skill) => {
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


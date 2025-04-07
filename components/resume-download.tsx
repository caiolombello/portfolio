"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDownTrayIcon, DocumentTextIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { jsPDF } from "jspdf"
import { useLanguage } from "@/contexts/language-context"

// Tipo para os dados do currículo
interface ResumeData {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
  }
  summary: string
  experiences: {
    title: string
    company: string
    period: string
    responsibilities: string[]
  }[]
  education: {
    degree: string
    institution: string
    period: string
    description: string
  }[]
  certifications: string[]
  skills: {
    name: string
    percentage: number
  }[]
}

export default function ResumeDownload({ resumeData }: { resumeData: ResumeData }) {
  const { language = "pt", t } = useLanguage() || {}
  const [isGenerating, setIsGenerating] = useState(false)

  // Função para gerar o conteúdo Markdown
  const generateMarkdownContent = (): string => {
    const { personalInfo, summary, experiences, education, certifications, skills } = resumeData

    let markdown = `# ${personalInfo.name}\n\n`
    markdown += `**${personalInfo.title}**\n\n`
    markdown += `Email: ${personalInfo.email} | ${t("phone")}: ${personalInfo.phone} | ${t("location")}: ${personalInfo.location}\n\n`

    // Resumo profissional
    markdown += `## ${t("about")}\n\n`
    markdown += `${summary}\n\n`

    // Experiência
    markdown += `## ${t("experience")}\n\n`
    experiences.forEach((exp) => {
      markdown += `### ${exp.title}\n`
      markdown += `**${exp.company}** | ${exp.period}\n\n`
      exp.responsibilities.forEach((resp) => {
        markdown += `- ${resp}\n`
      })
      markdown += "\n"
    })

    // Educação
    markdown += `## ${t("education")}\n\n`
    education.forEach((edu) => {
      markdown += `### ${edu.degree}\n`
      markdown += `**${edu.institution}** | ${edu.period}\n\n`
      markdown += `${edu.description}\n\n`
    })

    // Certificações
    markdown += `## ${t("certifications")}\n\n`
    certifications.forEach((cert) => {
      markdown += `- ${cert}\n`
    })
    markdown += "\n"

    // Habilidades
    markdown += `## ${t("skills")}\n\n`
    skills.forEach((skill) => {
      markdown += `- ${skill.name}: ${skill.percentage}%\n`
    })

    return markdown
  }

  const downloadMarkdown = () => {
    try {
      const markdownContent = generateMarkdownContent()

      // Criar um blob com o conteúdo Markdown
      const blob = new Blob([markdownContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)

      // Criar um link para download e clicar nele
      const a = document.createElement("a")
      a.href = url
      a.download = `resume-${language}.md`
      document.body.appendChild(a)
      a.click()

      // Limpar
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erro ao baixar o currículo em Markdown:", error)
    }
  }

  const downloadPDF = async () => {
    setIsGenerating(true)

    try {
      const markdownContent = generateMarkdownContent()

      // Converter Markdown para HTML simples
      const html = markdownToHTML(markdownContent)

      // Criar um elemento temporário para renderizar o HTML
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = html
      tempDiv.style.display = "none"
      document.body.appendChild(tempDiv)

      // Configurar o PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Adicionar estilos básicos
      const style = document.createElement("style")
      style.textContent = `
        body { font-family: Arial, sans-serif; color: #333; }
        h1 { font-size: 24px; color: #000; margin-bottom: 5px; }
        h2 { font-size: 18px; color: #333; margin-top: 15px; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
        h3 { font-size: 16px; color: #444; margin-bottom: 3px; }
        p { font-size: 12px; margin: 5px 0; }
        ul { padding-left: 20px; }
        li { font-size: 12px; margin: 3px 0; }
      `
      document.head.appendChild(style)

      // Gerar o PDF a partir do HTML
      pdf.html(tempDiv, {
        callback: (pdf) => {
          // Salvar o PDF
          pdf.save(`resume-${language}.pdf`)

          // Limpar
          document.body.removeChild(tempDiv)
          document.head.removeChild(style)
          setIsGenerating(false)
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800,
      })
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error)
      setIsGenerating(false)
    }
  }

  // Função simples para converter Markdown para HTML
  const markdownToHTML = (markdown: string): string => {
    let html = markdown

    // Cabeçalhos
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>")
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>")
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>")

    // Negrito
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Itálico
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Listas
    html = html.replace(/^- (.*$)/gm, "<li>$1</li>")
    html = html.replace(/(<li>.*<\/li>)\n(<li>)/g, "$1\n<ul>$2")
    html = html.replace(/(<\/li>)\n(?![<-])/g, "$1\n</ul>\n")

    // Parágrafos
    html = html.replace(/^(?!<[hl]|<ul|<li|<\/ul)(.*$)/gm, "<p>$1</p>")

    // Quebras de linha
    html = html.replace(/\n/g, "")

    return html
  }

  const generatePDF = async (lang: string) => {
    setIsGenerating(true)

    try {
      const markdownContent = generateMarkdownContent()
      const html = markdownToHTML(markdownContent)

      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = html
      tempDiv.style.display = "none"
      document.body.appendChild(tempDiv)

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const style = document.createElement("style")
      style.textContent = `
        body { font-family: Arial, sans-serif; color: #333; }
        h1 { font-size: 24px; color: #000; margin-bottom: 5px; }
        h2 { font-size: 18px; color: #333; margin-top: 15px; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
        h3 { font-size: 16px; color: #444; margin-bottom: 3px; }
        p { font-size: 12px; margin: 5px 0; }
        ul { padding-left: 20px; }
        li { font-size: 12px; margin: 3px 0; }
      `
      document.head.appendChild(style)

      pdf.html(tempDiv, {
        callback: (pdf) => {
          pdf.save(`resume-${lang}.pdf`)

          document.body.removeChild(tempDiv)
          document.head.removeChild(style)
          setIsGenerating(false)
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800,
      })
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error)
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={downloadMarkdown}
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        <DocumentTextIcon className="h-4 w-4" />
        Markdown
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isGenerating} className="flex items-center gap-2">
            {isGenerating ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-4 w-4" />
                PDF
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => downloadPDF()}>
            {t("download")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


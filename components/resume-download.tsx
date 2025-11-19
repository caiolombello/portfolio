"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { Download } from "lucide-react";

// Tipo para os dados do currículo
interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experiences: {
    title: string;
    company: string;
    period: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    description?: string;
  }[];
  certifications: string[];
  skills: {
    name: string;
    category: string;
    level: string;
  }[];
}

export default function ResumeDownload({
  resumeData,
  certificationsCredly,
}: {
  resumeData: ResumeData;
  certificationsCredly?: string[];
}) {
  const { language = "pt", t } = useLanguage() || {};

  // Função para gerar nome do arquivo baseado no idioma e data
  const getFileName = (extension: string): string => {
    const name = resumeData.personalInfo.name.replace(/\s+/g, "_");
    const role = resumeData.personalInfo.title.replace(/\s+/g, "_");
    const date = new Date().toISOString().split("T")[0];
    const lang = language.toUpperCase();

    return `${name}_${role}_${lang}_${date}.${extension}`;
  };

  // Função para gerar o conteúdo Markdown otimizado para ATS
  const generateMarkdownContent = (): string => {
    const { personalInfo, summary, experiences, education, skills } =
      resumeData;
    const allCertifications = [
      ...(resumeData.certifications || []),
      ...(certificationsCredly || []),
    ];

    // Cabeçalho com informações pessoais em formato claro
    let markdown = `# ${personalInfo.name}\n`;
    markdown += `${personalInfo.title}\n\n`;
    markdown += `Email: ${personalInfo.email}\n`;
    markdown += `Phone: ${personalInfo.phone}\n`;
    markdown += `Location: ${personalInfo.location}\n\n`;

    // Resumo profissional com palavras-chave relevantes
    markdown += `## ${t("about.title")}\n\n`;
    markdown += `${summary}\n\n`;

    // Experiência profissional com estrutura clara e consistente
    markdown += `## ${t("resume.experience.title")}\n\n`;
    experiences.forEach((exp) => {
      markdown += `### ${exp.title}\n`;
      markdown += `${exp.company}\n`;
      markdown += `${exp.period}\n\n`;
      markdown += `Responsibilities:\n`;
      exp.responsibilities.forEach((resp) => {
        markdown += `* ${resp}\n`;
      });
      markdown += "\n";
    });

    // Educação com formato padronizado
    markdown += `## ${t("resume.education.title")}\n\n`;
    education.forEach((edu) => {
      markdown += `### ${edu.degree}\n`;
      markdown += `${edu.institution}\n`;
      markdown += `${edu.period}\n`;
      if (edu.description) {
        markdown += `\n${edu.description}\n`;
      }
      markdown += "\n";
    });

    // Certificações em lista clara
    markdown += `## ${t("resume.certifications.title")}\n\n`;
    allCertifications.forEach((cert) => {
      markdown += `* ${cert}\n`;
    });
    markdown += "\n";

    // Habilidades agrupadas por categoria com níveis claros
    markdown += `## ${t("resume.skills.title")}\n\n`;
    const grouped: Record<string, { name: string; level: string }[]> = {};
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push({ name: skill.name, level: skill.level });
    });

    Object.entries(grouped).forEach(([category, skills]) => {
      markdown += `### ${t(category) || category}\n`;
      skills.forEach((skill) => {
        // Formato mais limpo para ATS: Nome da skill - Nível
        markdown += `* ${skill.name} - ${t(skill.level) || skill.level}\n`;
      });
      markdown += "\n";
    });

    return markdown;
  };

  const downloadMarkdown = () => {
    const content = generateMarkdownContent();
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getFileName("md");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    // Download the pre-generated PDF file
    const fileName = language === "pt" ? "curriculo.pdf" : "resume.pdf";

    try {
      const response = await fetch(`/${fileName}`, { method: "HEAD" });
      if (response.ok) {
        const link = document.createElement("a");
        link.href = `/${fileName}`;
        link.download = fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(
          language === "pt"
            ? "PDF não encontrado. Por favor, execute ./scripts/build-resume.sh para gerá-lo."
            : "PDF not found. Please run ./scripts/build-resume.sh to generate it."
        );
      }
    } catch (error) {
      console.error("Error checking PDF:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {language === "pt" ? "Baixar Currículo" : "Download Resume"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={downloadMarkdown}>
          {language === "pt" ? "Baixar como Markdown" : "Download as Markdown"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPDF}>
          {language === "pt" ? "Baixar como PDF" : "Download as PDF"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Skill } from "@/types/skill"
import skillsData from "@/content/data/skills.json"
import { useLanguage } from "@/contexts/language-context"
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiGit,
  SiDocker,
  SiKubernetes,
  SiAnsible,
  SiTerraform,
  SiAmazon,
  SiGooglecloud,
  SiLinux,
  SiGnubash,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGrafana,
  SiPrometheus,
  SiElasticsearch,
  SiKibana,
  SiJenkins,
  SiGithubactions,
  SiArgo,
  SiFlux,
  SiHelm,
} from "react-icons/si"
import { FaMicrosoft } from "react-icons/fa"
import { ChevronRight } from "lucide-react"
import { IconType } from "react-icons"

interface GroupedSkills {
  [category: string]: Skill[]
}

const CATEGORY_LABELS = {
  pt: {
    "Linguagens": "Linguagens",
    "Cloud/Infra": "Cloud/Infra",
    "CI/CD": "CI/CD",
    "Observabilidade": "Observabilidade",
    "Ferramentas": "Ferramentas",
    "Metodologias": "Metodologias"
  },
  en: {
    "Linguagens": "Languages",
    "Cloud/Infra": "Cloud/Infra",
    "CI/CD": "CI/CD",
    "Observabilidade": "Observability",
    "Ferramentas": "Tools",
    "Metodologias": "Methodologies"
  }
}

const LEVEL_LABELS = {
  pt: {
    "Avançado": "Avançado",
    "Experiente": "Experiente",
    "Proficiente": "Proficiente",
    "Familiarizado": "Familiarizado"
  },
  en: {
    "Avançado": "Advanced",
    "Experiente": "Experienced",
    "Proficiente": "Proficient",
    "Familiarizado": "Familiar"
  }
}

// Mapeamento dinâmico de ícones
const TECH_ICONS: Record<string, IconType> = {
  // Linguagens
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Python": SiPython,
  "Bash": SiGnubash,

  // Frontend
  "React": SiReact,
  "Next.js": SiNextdotjs,

  // Backend
  "Node.js": SiNodedotjs,
  "PostgreSQL": SiPostgresql,
  "MongoDB": SiMongodb,
  "Redis": SiRedis,

  // DevOps
  "Git": SiGit,
  "Docker": SiDocker,
  "Kubernetes": SiKubernetes,
  "Ansible": SiAnsible,
  "Terraform": SiTerraform,
  "Jenkins": SiJenkins,
  "GitHub Actions": SiGithubactions,
  "Argo CD": SiArgo,
  "Flux": SiFlux,
  "Helm": SiHelm,

  // Cloud
  "AWS": SiAmazon,
  "GCP": SiGooglecloud,
  "Azure": FaMicrosoft,

  // Observabilidade
  "Grafana": SiGrafana,
  "Prometheus": SiPrometheus,
  "Elasticsearch": SiElasticsearch,
  "Kibana": SiKibana,

  // Sistemas
  "Linux": SiLinux,
}

// Função para obter o ícone com fallback
const getTechIcon = (techName: string): IconType | null => {
  // Tenta encontrar o ícone exato
  const exactMatch = TECH_ICONS[techName]
  if (exactMatch) return exactMatch

  // Tenta encontrar por correspondência parcial (case insensitive)
  const partialMatch = Object.entries(TECH_ICONS).find(([key]) => 
    key.toLowerCase() === techName.toLowerCase()
  )
  if (partialMatch) return partialMatch[1]

  // Se não encontrar, retorna null
  return null
}

// Cores e ícones para níveis de proficiência
const LEVEL_STYLES: {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
} = {
  "Avançado": {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-900 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800"
  },
  "Experiente": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-900 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800"
  },
  "Proficiente": {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-900 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800"
  },
  "Familiarizado": {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-900 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-800"
  }
}

export default function SkillsList() {
  const { language } = useLanguage()
  const safeLang = (language === "pt" || language === "en" ? language : "en") as "pt" | "en"
  
  // Agrupar por categoria
  const grouped: GroupedSkills = (skillsData as Skill[]).reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || []
    acc[skill.category].push(skill)
    return acc
  }, {} as GroupedSkills)

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800" />
          <span className="text-sm text-emerald-900 dark:text-emerald-300">
            {language === "pt" ? "Avançado" : "Advanced"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" />
          <span className="text-sm text-blue-900 dark:text-blue-300">
            {language === "pt" ? "Experiente" : "Experienced"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800" />
          <span className="text-sm text-violet-900 dark:text-violet-300">
            {language === "pt" ? "Proficiente" : "Proficient"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800" />
          <span className="text-sm text-gray-900 dark:text-gray-300">
            {language === "pt" ? "Familiarizado" : "Familiar"}
          </span>
        </div>
      </div>

      {Object.entries(grouped).map(([category, skills]) => (
        <div key={category} className="mb-6">
          <h3 className="font-bold text-gold mb-2">
            {(CATEGORY_LABELS[safeLang] as Record<string, string>)[category] || category}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {skills.map(skill => {
              const Icon = getTechIcon(skill.name)
              const levelStyle = LEVEL_STYLES[skill.level]
              
              return (
                <li 
                  key={skill.name} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-200
                    ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}
                    hover:border-gold`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{skill.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}


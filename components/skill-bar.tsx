"use client";

import { useEffect, useRef, useState } from "react";
import { Skill, SkillLevel } from "@/types/skill";
import { useLanguage } from "@/contexts/language-context";
import * as SiIcons from "react-icons/si";
import type { IconType } from "react-icons";

interface GroupedSkills {
  [category: string]: Skill[];
}

const CATEGORY_LABELS = {
  pt: {
    Linguagens: "Linguagens",
    "Cloud/Infra": "Cloud/Infra",
    "CI/CD": "CI/CD",
    Observabilidade: "Observabilidade",
    Frontend: "Frontend",
    Backend: "Backend",
    "Banco de Dados": "Banco de Dados",
    Ferramentas: "Ferramentas",
    Outros: "Outros",
  },
  en: {
    Linguagens: "Languages",
    "Cloud/Infra": "Cloud/Infra",
    "CI/CD": "CI/CD",
    Observabilidade: "Observability",
    Frontend: "Frontend",
    Backend: "Backend",
    "Banco de Dados": "Databases",
    Ferramentas: "Tools",
    Outros: "Others",
  },
};

const LEVEL_LABELS = {
  pt: {
    Avançado: "Avançado",
    Experiente: "Experiente",
    Proficiente: "Proficiente",
    Familiarizado: "Familiarizado",
    Iniciante: "Iniciante",
  },
  en: {
    Avançado: "Advanced",
    Experiente: "Experienced",
    Proficiente: "Proficient",
    Familiarizado: "Familiar",
    Iniciante: "Beginner",
  },
};

// Mapeamento manual para casos especiais
const ICON_MAPPING: Record<string, string> = {
  "Node.js": "Nodejs",
  "Next.js": "Nextdotjs",
  "Vue.js": "Vuedotjs",
  "Express.js": "Express",
  ".NET": "Dotnet",
  "ASP.NET": "Dotnet",
  "C#": "Csharp",
  "F#": "Fsharp",
  "GitHub Actions": "GithubActions",
  "GitLab CI": "Gitlab",
  "Argo CD": "Argocd",
  AWS: "Amazonaws",
  "Amazon Web Services": "Amazonaws",
  "Google Cloud": "Googlecloud",
  GCP: "Googlecloud",
  "Azure DevOps": "Azuredevops",
  PostgreSQL: "Postgresql",
  MongoDB: "Mongodb",
  Redis: "Redis",
  ElasticSearch: "Elasticsearch",
  "Elastic Stack": "Elasticsearch",
  "ELK Stack": "Elasticsearch",
  "Visual Studio Code": "Vscode",
  "VS Code": "Vscode",
  "GNU/Linux": "Linux",
  Bash: "Gnubash",
  "Shell Script": "Gnubash",
  "Docker Compose": "Docker",
  "Docker Swarm": "Docker",
  "Helm Charts": "Helm",
};

const LEVEL_STYLES: Record<
  SkillLevel,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  Avançado: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-900 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  Experiente: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-900 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  Proficiente: {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-900 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
  },
  Familiarizado: {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-900 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-800",
  },
  Iniciante: {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-900 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-800",
  },
};

interface SiIconsType {
  [key: string]: IconType;
}

function findIcon(skillName: string): IconType | null {
  // Primeiro, verifica se há um mapeamento manual para o nome da habilidade
  const mappedName = ICON_MAPPING[skillName];
  if (mappedName && (SiIcons as SiIconsType)[`Si${mappedName}`]) {
    return (SiIcons as SiIconsType)[`Si${mappedName}`];
  }

  // Limpa o nome da habilidade para tentar encontrar o ícone
  const cleanName = skillName
    .replace(/[^a-zA-Z0-9]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, ""); // Remove espaços

  // Tenta encontrar o ícone com o nome limpo
  const iconName = `Si${cleanName}`;
  return (SiIcons as SiIconsType)[iconName] || null;
}

export default function SkillsList() {
  const { language } = useLanguage();
  const safeLang = (
    language === "pt" || language === "en" ? language : "en"
  ) as "pt" | "en";
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/public/skills");
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills_list || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }
    fetchSkills();
  }, []);

  // Agrupar por categoria
  const grouped: GroupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as GroupedSkills);

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
            {(CATEGORY_LABELS[safeLang] as Record<string, string>)[category] ||
              category}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const Icon = findIcon(skill.name);
              const levelStyle = LEVEL_STYLES[skill.level];

              return (
                <li
                  key={skill.name}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-200
                    ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}
                    hover:border-gold`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{skill.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skill, SkillLevel } from "@/types/skill";
import { useLanguage } from "@/contexts/language-context";
import * as SiIcons from "react-icons/si";
import type { IconType } from "react-icons";

interface GroupedSkills {
  [category: string]: Skill[];
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  pt: {
    Linguagens: "Linguagens",
    "Cloud/Infra": "Cloud/Infra",
    "CI/CD": "CI/CD",
    Observabilidade: "Observabilidade",
    "Containerização": "Containerização",
    "Segurança": "Segurança",
    "Automação": "Automação",
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
    "Containerização": "Containerization",
    "Segurança": "Security",
    "Automação": "Automation",
    Frontend: "Frontend",
    Backend: "Backend",
    "Banco de Dados": "Databases",
    Ferramentas: "Tools",
    Outros: "Others",
  },
};

const LEVEL_LABELS: Record<string, Record<string, string>> = {
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

// Ordem de prioridade dos niveis (menor = mais avancado)
const LEVEL_ORDER: Record<SkillLevel, number> = {
  Avançado: 0,
  Experiente: 1,
  Proficiente: 2,
  Familiarizado: 3,
  Iniciante: 4,
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
  OpenTelemetry: "Opentelemetry",
  "OpenTelemetry Collector": "Opentelemetry",
  "OpenTelemetry SDK": "Opentelemetry",
  "OpenTelemetry API": "Opentelemetry",
  "OpenTelemetry Instrumentation": "Opentelemetry",
  "OpenTelemetry Tracing": "Opentelemetry",
  "OpenTelemetry Metrics": "Opentelemetry",
  "Oracle Cloud": "Oracle",
  ArgoCD: "Argo",
  "HashiCorp Consul": "Consul",
  "HashiCorp Vault": "Vault",
  "HashiCorp Terraform": "Terraform",
  "HashiCorp Nomad": "Nomad",
  "HashiCorp Packer": "Packer",
  Keycloak: "Keycloak",
  LLMs: "Openai",
};

const LEVEL_STYLES: Record<
  SkillLevel,
  { bg: string; text: string; border: string }
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
  const mappedName = ICON_MAPPING[skillName];
  if (mappedName && (SiIcons as SiIconsType)[`Si${mappedName}`]) {
    return (SiIcons as SiIconsType)[`Si${mappedName}`];
  }

  const cleanName = skillName
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/\s+/g, "");

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
        const response = await fetch("/api/skills");
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

  // Agrupar por categoria e ordenar por nivel
  const grouped: GroupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as GroupedSkills);

  // Ordenar skills dentro de cada categoria por nivel
  for (const category in grouped) {
    grouped[category].sort(
      (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
    );
  }

  const categories = Object.entries(grouped);

  return (
    <div>
      {/* Legenda */}
      <div className="mb-8 flex flex-wrap gap-4" suppressHydrationWarning>
        {(
          [
            {
              level: "Avançado" as const,
              color:
                "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
              textColor: "text-emerald-900 dark:text-emerald-300",
            },
            {
              level: "Experiente" as const,
              color:
                "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
              textColor: "text-blue-900 dark:text-blue-300",
            },
            {
              level: "Proficiente" as const,
              color:
                "bg-violet-100 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800",
              textColor: "text-violet-900 dark:text-violet-300",
            },
            {
              level: "Familiarizado" as const,
              color:
                "bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800",
              textColor: "text-gray-900 dark:text-gray-300",
            },
          ] as const
        ).map(({ level, color, textColor }) => (
          <div key={level} className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full border ${color}`}
            />
            <span
              className={`text-sm ${textColor}`}
              suppressHydrationWarning
            >
              {LEVEL_LABELS[safeLang][level] || level}
            </span>
          </div>
        ))}
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(([category, categorySkills], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-lg border border-border/40 bg-card p-5 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10"
          >
            {/* Header da categoria */}
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-bold text-gold"
                suppressHydrationWarning
              >
                {CATEGORY_LABELS[safeLang]?.[category] || category}
              </h3>
              <span className="text-xs text-muted-foreground rounded-full bg-secondary px-2 py-0.5">
                {categorySkills.length}
              </span>
            </div>

            {/* Pills */}
            <ul className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => {
                const Icon = findIcon(skill.name);
                const levelStyle = LEVEL_STYLES[skill.level];
                const levelLabel =
                  LEVEL_LABELS[safeLang][skill.level] || skill.level;

                return (
                  <li
                    key={skill.name}
                    title={levelLabel}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-200 cursor-default
                      ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}
                      hover:border-gold`}
                  >
                    {Icon && <Icon size={14} />}
                    <span className="text-sm">{skill.name}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

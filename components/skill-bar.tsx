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
    Containerização: "Containerização",
    Segurança: "Segurança",
    Automação: "Automação",
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
    Containerização: "Containerization",
    Segurança: "Security",
    Automação: "Automation",
    Frontend: "Frontend",
    Backend: "Backend",
    "Banco de Dados": "Databases",
    Ferramentas: "Tools",
    Outros: "Others",
  },
};

const LEVEL_LABELS: Record<string, Record<string, string>> = {
  pt: {
    Avançado: "Principal",
    Experiente: "Uso recorrente",
    Proficiente: "Uso prático",
    Familiarizado: "Familiaridade",
    Iniciante: "Em aprendizado",
  },
  en: {
    Avançado: "Core",
    Experiente: "Regular use",
    Proficiente: "Working knowledge",
    Familiarizado: "Familiar",
    Iniciante: "Learning",
  },
};

const LEVEL_HELP: Record<"pt" | "en", string> = {
  pt: "Níveis baseados na profundidade e na frequência de uso em projetos reais.",
  en: "Levels reflect depth and frequency of use in real projects.",
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
  {
    bg: string;
    text: string;
    border: string;
    marker: string;
    strength: number;
  }
> = {
  Avançado: {
    bg: "bg-gold/15",
    text: "text-foreground dark:text-gold",
    border: "border-gold/50",
    marker: "bg-gold",
    strength: 5,
  },
  Experiente: {
    bg: "bg-gold/5",
    text: "text-foreground",
    border: "border-gold/30",
    marker: "bg-gold/65",
    strength: 4,
  },
  Proficiente: {
    bg: "bg-secondary",
    text: "text-foreground",
    border: "border-border",
    marker: "bg-muted-foreground/75",
    strength: 3,
  },
  Familiarizado: {
    bg: "bg-transparent",
    text: "text-muted-foreground",
    border: "border-dashed border-border",
    marker: "bg-muted-foreground/45",
    strength: 2,
  },
  Iniciante: {
    bg: "bg-transparent",
    text: "text-muted-foreground",
    border: "border-dashed border-border/70",
    marker: "bg-muted-foreground/30",
    strength: 1,
  },
};

function LevelSignal({ level }: { level: SkillLevel }) {
  const style = LEVEL_STYLES[level];

  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${
            index < style.strength ? style.marker : "bg-border/80"
          }`}
        />
      ))}
    </span>
  );
}

interface SiIconsType {
  [key: string]: IconType;
}

function findIcon(skillName: string): IconType | null {
  const mappedName = ICON_MAPPING[skillName];
  if (mappedName && (SiIcons as SiIconsType)[`Si${mappedName}`]) {
    return (SiIcons as SiIconsType)[`Si${mappedName}`];
  }

  const cleanName = skillName.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "");

  const iconName = `Si${cleanName}`;
  return (SiIcons as SiIconsType)[iconName] || null;
}

interface SkillsListProps {
  initialSkills?: Skill[];
}

export default function SkillsList({ initialSkills }: SkillsListProps = {}) {
  const { language } = useLanguage();
  const safeLang = (
    language === "pt" || language === "en" ? language : "en"
  ) as "pt" | "en";
  const [skills, setSkills] = useState<Skill[]>(initialSkills || []);

  useEffect(() => {
    if (initialSkills) return;

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
  }, [initialSkills]);

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
  const visibleLevels = (Object.keys(LEVEL_STYLES) as SkillLevel[]).filter(
    (level) => skills.some((skill) => skill.level === level),
  );

  return (
    <div>
      <div className="mb-8" suppressHydrationWarning>
        <p className="text-xs leading-5 text-muted-foreground">
          {LEVEL_HELP[safeLang]}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {visibleLevels.map((level) => (
            <li
              key={level}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <LevelSignal level={level} />
              <span>{LEVEL_LABELS[safeLang][level] || level}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(([category, categorySkills], index) => (
          <motion.div
            key={category}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-xl border border-border/70 bg-card/40 p-5 transition-colors duration-300 hover:border-gold/40"
          >
            {/* Header da categoria */}
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold text-foreground"
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
                    aria-label={`${skill.name}: ${levelLabel}`}
                    className={`group relative flex cursor-default items-center gap-2 rounded-full border px-3 py-1.5 transition-colors duration-200
                      ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}
                      hover:border-gold`}
                  >
                    {Icon && <Icon size={14} aria-hidden="true" />}
                    <span className="text-sm">{skill.name}</span>
                    <LevelSignal level={skill.level} />
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

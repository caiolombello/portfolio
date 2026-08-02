import { z } from "zod";
import {
  EducationSchema,
  ExperienceSchema,
  ProfileSchema,
  SkillSchema,
} from "../validation";
import type { Skill } from "../../types";
import { formatResumePeriod } from "./period";

export const resumeLocales = ["pt", "en"] as const;

export type ResumeLocale = (typeof resumeLocales)[number];

const ResumeSourceSchema = z.object({
  profile: ProfileSchema,
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillSchema),
});

export type ResumeSource = z.input<typeof ResumeSourceSchema>;

export interface ResumePersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface ResumeExperience {
  company: string;
  logo?: string;
  companyUrl?: string;
  title: string;
  period: string;
  responsibilities: string[];
}

export interface ResumeEducation {
  institution: string;
  logo?: string;
  institutionUrl?: string;
  degree: string;
  period: string;
  description?: string;
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeModel {
  locale: ResumeLocale;
  personalInfo: ResumePersonalInfo;
  summary: string;
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: Skill[];
  skillGroups: ResumeSkillGroup[];
  labels: {
    about: string;
    experience: string;
    education: string;
    skills: string;
  };
}

export type ResumeModels = Record<ResumeLocale, ResumeModel>;

const labels: Record<ResumeLocale, ResumeModel["labels"]> = {
  pt: {
    about: "Sobre",
    experience: "Experiência Profissional",
    education: "Educação",
    skills: "Habilidades",
  },
  en: {
    about: "About",
    experience: "Professional Experience",
    education: "Education",
    skills: "Skills",
  },
};

const englishCategoryLabels: Record<string, string> = {
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
};

function timestamp(value?: string): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function buildSkillGroups(
  skills: Skill[],
  locale: ResumeLocale,
): ResumeSkillGroup[] {
  const groups = new Map<string, string[]>();

  for (const skill of skills) {
    const category =
      locale === "en"
        ? englishCategoryLabels[skill.category] || skill.category
        : skill.category;
    const items = groups.get(category) || [];
    items.push(skill.name);
    groups.set(category, items);
  }

  return Array.from(groups, ([category, items]) => ({ category, items }));
}

export function buildResumeModels(input: unknown): ResumeModels {
  const source = ResumeSourceSchema.parse(input);
  const experiences = [...source.experiences].sort(
    (a, b) => timestamp(b.startDate) - timestamp(a.startDate),
  );
  const education = [...source.education].sort(
    (a, b) => timestamp(b.endDate) - timestamp(a.endDate),
  );

  return Object.fromEntries(
    resumeLocales.map((locale) => {
      const profile = source.profile[locale];
      const model: ResumeModel = {
        locale,
        personalInfo: {
          name: profile.name,
          title: profile.title,
          location: profile.location || "",
          email: source.profile.email,
          phone: source.profile.phone || "",
          linkedin: source.profile.socialLinks?.linkedin || "",
          github: source.profile.socialLinks?.github || "",
        },
        summary: profile.about,
        experiences: experiences.map((experience) => ({
          company: experience.company,
          logo: experience.logo,
          companyUrl: experience.companyUrl,
          title: locale === "pt" ? experience.title_pt : experience.title_en,
          period: formatResumePeriod(
            experience.startDate,
            experience.endDate,
            experience.period,
            locale,
          ),
          responsibilities: (locale === "pt"
            ? experience.responsibilities_pt
            : experience.responsibilities_en
          ).map(({ item }) => item),
        })),
        education: education.map((item) => ({
          institution: item.institution,
          logo: item.logo,
          institutionUrl: item.institutionUrl,
          degree: locale === "pt" ? item.degree_pt : item.degree_en,
          period: formatResumePeriod(
            item.startDate,
            item.endDate,
            item.period,
            locale,
          ),
          description:
            locale === "pt" ? item.description_pt : item.description_en,
        })),
        skills: source.skills,
        skillGroups: buildSkillGroups(source.skills, locale),
        labels: labels[locale],
      };

      return [locale, model];
    }),
  ) as ResumeModels;
}

import { z } from "zod";

// Profile Schemas
export const ProfileLocaleSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string().optional(),
  birthDate: z.string().optional(),
  about: z.string(),
});

export const SocialLinksSchema = z.object({
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  twitter: z.string().url().optional(),
});

export const ProfileSchema = z.object({
  pt: ProfileLocaleSchema,
  en: ProfileLocaleSchema,
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  socialLinks: SocialLinksSchema.optional(),
});

// Skills Schemas
export const SkillCategorySchema = z.enum([
  "Linguagens",
  "Cloud/Infra",
  "CI/CD",
  "Observabilidade",
  "Frontend",
  "Backend",
  "Banco de Dados",
  "Ferramentas",
  "Outros",
]);

export const SkillLevelSchema = z.enum([
  "Avançado",
  "Experiente",
  "Proficiente",
  "Familiarizado",
  "Iniciante",
]);

export const SkillSchema = z.object({
  name: z.string(),
  category: SkillCategorySchema,
  level: SkillLevelSchema,
});

export const SkillsDataSchema = z.object({
  skills_list: z.array(SkillSchema),
});

// Experience Schemas
export const ResponsibilityItemSchema = z.object({
  item: z.string(),
});

export const ExperienceSchema = z.object({
  company: z.string(),
  title_pt: z.string(),
  title_en: z.string(),
  title_es: z.string().optional(),
  period: z.string(),
  responsibilities_pt: z.array(ResponsibilityItemSchema),
  responsibilities_en: z.array(ResponsibilityItemSchema),
  responsibilities_es: z.array(ResponsibilityItemSchema).optional(),
  startDate: z.string().optional(),
});

// Education Schema
export const EducationSchema = z.object({
  institution: z.string(),
  degree_pt: z.string(),
  degree_en: z.string(),
  period: z.string(),
  description_pt: z.string().optional(),
  description_en: z.string().optional(),
  endDate: z.string().optional(),
});

// Certification Schema
export const CertificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  description: z.string().optional(),
  url: z.string().url().optional(),
});

// Project Schemas
export const TechnologySchema = z.object({
  tech: z.string(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  title_pt: z.string(),
  title_en: z.string(),
  shortDescription_pt: z.string(),
  shortDescription_en: z.string(),
  description_pt: z.string(),
  description_en: z.string(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  technologies: z.array(TechnologySchema).optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Blog Post Schemas
export const AuthorSchema = z.object({
  name: z.string(),
  avatar: z.string().optional(),
});

export const PostSchema = z.object({
  slug_pt: z.string(),
  slug_en: z.string(),
  title_pt: z.string(),
  title_en: z.string(),
  title_es: z.string().optional(),
  summary_pt: z.string(),
  summary_en: z.string(),
  summary_es: z.string().optional(),
  publicationDate: z.string(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: AuthorSchema.optional(),
  body_pt: z.string(),
  body_en: z.string(),
  body_es: z.string().optional(),
  published: z.boolean().optional(),
});

import "server-only";

import fs from "fs";
import path from "path";
import type { Locale } from "@/app/i18n/settings";
import { getSiteConfig } from "@/lib/config-server";
import {
  getEducationData,
  getExperiencesData,
  getPostsData,
  getProfileData,
  getProjectsData,
  getSkillsData,
  getTestimonialsData,
} from "@/lib/data";
import { getCopy } from "@/lib/locale/copy";
import {
  contentLocale,
  formatDuration,
  formatMonthYear,
  localized,
  localizedList,
  monthsBetween,
  readingTimeMinutes,
} from "@/lib/locale/format";
import type { Post } from "@/types/blog";
import type { Project } from "@/types/project";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

/* ------------------------------------------------------------------ person */

export interface FocusArea {
  icon: string;
  title: string;
  description: string;
}

interface ProfileLocaleContent {
  name: string;
  title: string;
  role?: string;
  location: string;
  about: string;
  headline?: string[];
  intro?: string;
  focus?: FocusArea[];
}

interface ProfileContent {
  pt: ProfileLocaleContent;
  en: ProfileLocaleContent;
  email: string;
  phone: string;
  languages?: Record<string, string>[];
  socialLinks?: Record<string, string | undefined>;
}

export interface Person {
  name: string;
  /** Full headline, as on the resume */
  title: string;
  /** Short role for the site chrome (header, hero, footer) */
  role: string;
  /** Profile photo URL (config/site.json → site.profileImage) */
  photo: string;
  location: string;
  about: string;
  headline: [string, string];
  intro: string;
  focus: FocusArea[];
  languages: { name: string; level: string }[];
  email: string;
  phone: string;
  whatsappUrl: string;
  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  credlyUsername?: string;
}

export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export async function getPerson(locale: Locale): Promise<Person> {
  const config = getSiteConfig();
  const profile = (await getProfileData()) as ProfileContent | null;
  const content = profile?.[contentLocale(locale)] ?? profile?.pt;

  const name = content?.name || config.site.shortName;
  const title = content?.title || config.site.title.split(" - ")[1] || "";
  const phone = profile?.phone || config.site.phone;
  const headline = content?.headline ?? [];

  const credly = config.integrations?.credlyUsername;
  const profileImage = config.site.profileImage;
  // Local files are served directly; GitHub/external sources go through the resolver route
  const photo =
    typeof profileImage === "string"
      ? profileImage
      : profileImage?.type === "local"
        ? profileImage.source
        : "/api/profile-image";

  return {
    name,
    title,
    role: content?.role || title,
    photo,
    location: content?.location || config.site.location,
    about: content?.about || config.site.description,
    headline: [headline[0] ?? title, headline[1] ?? ""],
    intro: content?.intro || config.site.description,
    focus: content?.focus ?? [],
    languages: (profile?.languages ?? []).map((language) => ({
      name: localized(language, "name", locale),
      level: localized(language, "level", locale),
    })),
    email: profile?.email || config.site.email,
    phone,
    whatsappUrl: whatsappUrl(phone, getCopy(locale).contactCta.whatsappMessage),
    links: {
      github: profile?.socialLinks?.github || config.social.github,
      linkedin: profile?.socialLinks?.linkedin || config.social.linkedin,
      twitter: profile?.socialLinks?.twitter || config.social.twitter,
    },
    credlyUsername:
      credly && credly !== "your-credly-username" ? credly : undefined,
  };
}

/* ---------------------------------------------------------------- projects */

export interface ProjectView {
  id: string;
  href: string;
  title: string;
  tagline: string;
  summary: string;
  paragraphs: string[];
  highlights: string[];
  category: string;
  categoryLabel: string;
  status?: string;
  statusLabel?: string;
  year?: number;
  license?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  isPrivate: boolean;
}

export function toProjectView(project: Project, locale: Locale): ProjectView {
  const copy = getCopy(locale).projects;
  const category = project.category ?? "";
  const description = localized(project, "description", locale);

  return {
    id: project.id,
    href: getLocalizedInstitutionalPath(
      `/portfolio/${project.id}`,
      contentLocale(locale),
    ),
    title: localized(project, "title", locale),
    tagline: localized(project, "tagline", locale),
    summary: localized(project, "shortDescription", locale),
    paragraphs: description
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    highlights: localizedList(project, "highlights", locale),
    category,
    categoryLabel: copy.categories[category] ?? category,
    status: project.status,
    statusLabel: project.status
      ? (copy.statuses[project.status] ?? project.status)
      : undefined,
    year: project.year,
    license: project.license,
    technologies: (project.technologies ?? []).map(
      (technology) => technology.tech,
    ),
    githubUrl: project.githubUrl || undefined,
    liveUrl: project.liveUrl?.startsWith("/")
      ? getLocalizedInstitutionalPath(project.liveUrl, contentLocale(locale))
      : project.liveUrl || undefined,
    imageUrl: project.imageUrl || undefined,
    featured: Boolean(project.featured),
    isPrivate: project.status === "private" || !project.githubUrl,
  };
}

export async function getProjects(locale: Locale): Promise<ProjectView[]> {
  const projects = (await getProjectsData()) as Project[];
  return projects.map((project) => toProjectView(project, locale));
}

/* ------------------------------------------------------------------ career */

interface ExperienceContent {
  company: string;
  title_pt: string;
  title_en: string;
  summary_pt?: string;
  summary_en?: string;
  responsibilities_pt?: { item: string }[];
  responsibilities_en?: { item: string }[];
  startDate: string;
  endDate?: string;
}

export interface RoleView {
  title: string;
  summary: string;
  period: string;
  duration: string;
  current: boolean;
  responsibilities: string[];
}

export interface CompanyView {
  company: string;
  period: string;
  duration: string;
  current: boolean;
  roles: RoleView[];
}

export interface Career {
  companies: CompanyView[];
  firstStart?: string;
  years: number;
  currentRole?: { title: string; company: string };
}

function periodLabel(
  start: string,
  end: string | undefined,
  locale: Locale,
): string {
  const present = getCopy(locale).resume.present;
  return `${formatMonthYear(start, locale)} — ${end ? formatMonthYear(end, locale) : present}`;
}

export async function getCareer(locale: Locale): Promise<Career> {
  const entries = (await getExperiencesData()) as ExperienceContent[];
  const groups: { company: string; entries: ExperienceContent[] }[] = [];

  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.company === entry.company) {
      last.entries.push(entry);
    } else {
      groups.push({ company: entry.company, entries: [entry] });
    }
  }

  const companies = groups.map(({ company, entries: roles }) => {
    const start = roles.map((role) => role.startDate).sort()[0];
    const current = roles.some((role) => !role.endDate);
    const end = current
      ? undefined
      : roles
          .map((role) => role.endDate as string)
          .sort()
          .reverse()[0];

    return {
      company,
      period: periodLabel(start, end, locale),
      duration: formatDuration(monthsBetween(start, end), locale),
      current,
      roles: roles.map((role) => ({
        title: localized(role, "title", locale),
        summary: localized(role, "summary", locale),
        period: periodLabel(role.startDate, role.endDate, locale),
        duration: formatDuration(
          monthsBetween(role.startDate, role.endDate),
          locale,
        ),
        current: !role.endDate,
        responsibilities: localizedList(role, "responsibilities", locale),
      })),
    };
  });

  const firstStart = entries.map((entry) => entry.startDate).sort()[0];
  const currentEntry = entries.find((entry) => !entry.endDate);

  return {
    companies,
    firstStart,
    years: firstStart ? Math.floor(monthsBetween(firstStart) / 12) : 0,
    currentRole: currentEntry
      ? {
          title: localized(currentEntry, "title", locale),
          company: currentEntry.company,
        }
      : undefined,
  };
}

export interface EducationView {
  institution: string;
  degree: string;
  period: string;
  description: string;
  completed: boolean;
}

export async function getEducation(locale: Locale): Promise<EducationView[]> {
  const entries = (await getEducationData()) as Record<string, string>[];
  return entries.map((entry) => ({
    institution: entry.institution,
    degree: localized(entry, "degree", locale),
    period: entry.startDate
      ? `${formatMonthYear(entry.startDate, locale)} — ${
          entry.endDate
            ? formatMonthYear(entry.endDate, locale)
            : getCopy(locale).resume.present
        }`
      : entry.period,
    description: localized(entry, "description", locale),
    completed: Boolean(entry.endDate) && new Date(entry.endDate) < new Date(),
  }));
}

/* ------------------------------------------------------------------ skills */

export interface SkillGroup {
  key: string;
  label: string;
  skills: { name: string; level?: string; levelLabel?: string }[];
}

export async function getSkillGroups(locale: Locale): Promise<SkillGroup[]> {
  const copy = getCopy(locale).resume;
  const data = (await getSkillsData()) as {
    skills_list?: {
      name: string;
      name_en?: string;
      category: string;
      level?: string;
    }[];
  };
  const groups = new Map<string, SkillGroup>();

  for (const skill of data.skills_list ?? []) {
    const group = groups.get(skill.category) ?? {
      key: skill.category,
      label: copy.skillCategories[skill.category] ?? skill.category,
      skills: [],
    };
    group.skills.push({
      // `name` is the Portuguese/neutral name; `name_en` only exists when it needs translating
      name:
        contentLocale(locale) === "en" && skill.name_en
          ? skill.name_en
          : skill.name,
      level: skill.level,
      levelLabel: skill.level
        ? (copy.levels[skill.level] ?? skill.level)
        : undefined,
    });
    groups.set(skill.category, group);
  }

  return Array.from(groups.values());
}

/* ---------------------------------------------------------- certifications */

export interface CertificationView {
  name: string;
  issuer: string;
  issuedAt: string;
  expiresAt?: string;
  image?: string;
  url?: string;
}

export async function getCertifications(): Promise<{
  certifications: CertificationView[];
  trainingBadges: CertificationView[];
}> {
  const filePath = path.join(process.cwd(), "content/certifications.json");
  if (!fs.existsSync(filePath))
    return { certifications: [], trainingBadges: [] };
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    certifications?: CertificationView[];
    trainingBadges?: CertificationView[];
  };
  return {
    certifications: data.certifications ?? [],
    trainingBadges: data.trainingBadges ?? [],
  };
}

/* ------------------------------------------------------------ testimonials */

export interface TestimonialView {
  id: string;
  name: string;
  role: string;
  quote: string;
  image?: string;
  linkedin?: string;
}

export async function getTestimonials(
  locale: Locale,
): Promise<TestimonialView[]> {
  const testimonials = (await getTestimonialsData()) as Record<
    string,
    string
  >[];
  return testimonials.map((testimonial) => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    quote:
      contentLocale(locale) === "pt"
        ? testimonial.content_pt || testimonial.content
        : testimonial.content,
    image: testimonial.image,
    linkedin: testimonial.linkedin,
  }));
}

/* ------------------------------------------------------------------- posts */

export interface PostView {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

export function toPostView(post: Post, locale: Locale): PostView {
  const lang = contentLocale(locale);
  return {
    slug: lang === "pt" ? post.slug_pt : post.slug_en,
    title:
      (lang === "pt" ? post.title_pt : post.title_en) ||
      post.title_pt ||
      post.title_en,
    summary: (lang === "pt" ? post.summary_pt : post.summary_en) || "",
    date: post.publicationDate,
    tags: (lang === "pt" ? post.tags_pt : post.tags_en) ?? post.tags ?? [],
    coverImage: post.coverImage || undefined,
    readingTime: readingTimeMinutes(
      (lang === "pt" ? post.body_pt : post.body_en) || "",
    ),
  };
}

export async function getPosts(locale: Locale): Promise<PostView[]> {
  const posts = (await getPostsData(locale)) as Post[];
  return posts.map((post) => toPostView(post, locale));
}

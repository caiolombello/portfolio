import { CmsCollection, CmsField } from "decap-cms-core";

export interface LocalizedContent {
  pt: {
    name: string;
    title: string;
    location?: string;
    about: string;
  };
  en: {
    name: string;
    title: string;
    location?: string;
    about: string;
  };
}

export interface ProfileData extends LocalizedContent {
  email: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface Skill {
  name: string;
  category:
    | "Linguagens"
    | "Cloud/Infra"
    | "CI/CD"
    | "Observabilidade"
    | "Frontend"
    | "Backend"
    | "Banco de Dados"
    | "Ferramentas"
    | "Outros";
  level:
    | "Avançado"
    | "Experiente"
    | "Proficiente"
    | "Familiarizado"
    | "Iniciante";
}

export interface SkillsData {
  skills_list: Skill[];
}

export interface Experience {
  company: string;
  title_pt: string;
  title_en: string;
  period: string;
  responsibilities_pt: { item: string }[];
  responsibilities_en: { item: string }[];
  startDate: string;
}

export interface Education {
  institution: string;
  degree_pt: string;
  degree_en: string;
  period: string;
  description_pt?: string;
  description_en?: string;
  endDate: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  description?: string;
  url?: string;
}

export interface Project {
  id: string;
  title_pt: string;
  title_en: string;
  shortDescription_pt: string;
  shortDescription_en: string;
  description_pt: string;
  description_en: string;
  imageUrl?: string;
  category: string;
  technologies: { tech: string }[];
  githubUrl?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  title_pt: string;
  title_en: string;
  summary_pt: string;
  summary_en: string;
  publicationDate: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  published: boolean;
  body_pt: string;
  body_en: string;
}

export interface CmsEntry<T = unknown> {
  getIn: (path: string[]) => T;
  toJS: () => T;
}

export interface PreviewProps<T = unknown> {
  entry: CmsEntry<T>;
  collection?: string;
  slug?: string;
}

export interface CmsWindow extends Window {
  CMS: {
    registerPreviewTemplate: (name: string, component: React.ComponentType<PreviewProps>) => void;
    registerPreviewStyle: (path: string) => void;
  };
}

export interface CmsAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface CmsMetadata {
  title: {
    default: string;
    template: string;
  };
  description: string;
  keywords: string[];
  authors: { name: string }[];
  creator: string;
  publisher: string;
  robots: {
    index: boolean;
    follow: boolean;
    googleBot: {
      index: boolean;
      follow: boolean;
      maxSnippet: number;
      maxImagePreview: string;
      maxVideoPreview: number;
    };
  };
  openGraph: {
    type: string;
    locale: string;
    url: string;
    title: string;
    description: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator: string;
  };
  verification: {
    google: string;
    bing: string;
    yandex: string;
    other: Record<string, string>;
  };
  alternates: {
    canonical: string;
    languages: Record<string, string>;
  };
  category: string;
}

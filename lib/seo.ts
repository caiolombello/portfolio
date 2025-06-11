import { Metadata } from "next";
import { getSiteConfig } from "./config-server";

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType: "website" | "article" | "profile";
  twitterCard: "summary" | "summary_large_image";
  noindex?: boolean;
  alternates?: {
    languages?: Record<string, string>;
    canonical?: string;
  };
  authors?: Array<{ name: string; url?: string }>;
}

const defaultConfig: Partial<SeoConfig> = {
  ogType: "website",
  twitterCard: "summary_large_image",
  noindex: process.env.NODE_ENV !== "production",
};

interface ArticleOpenGraph {
  type: "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  locale?: string;
  alternateLocale?: string[];
}

interface ProfileOpenGraph {
  type: "profile";
  firstName?: string;
  lastName?: string;
  locale?: string;
  alternateLocale?: string[];
}

// Helper to build a dynamic OG image URL for any page type
export function buildOgImageUrl(params: {
  title: string;
  subtitle?: string;
  coverImage?: string;
}): string {
  const url = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL || '');
  url.searchParams.set('title', params.title);
  if (params.subtitle) url.searchParams.set('subtitle', params.subtitle);
  if (params.coverImage) url.searchParams.set('coverImage', params.coverImage);
  return url.toString();
}

export function generateSeoMetadata(config: Partial<SeoConfig>): Metadata {
  const fullConfig = { ...defaultConfig, ...config } as Required<SeoConfig>;
  const siteConfig = getSiteConfig();
  const {
    title,
    description,
    keywords,
    ogImage,
    ogType,
    twitterCard,
    noindex,
    alternates,
    authors,
  } = fullConfig;

  // If no ogImage provided, fallback to dynamic route
  const finalOgImage = ogImage || buildOgImageUrl({ title, subtitle: description });

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    authors,
    openGraph: {
      title,
      description,
      url: alternates?.canonical ?? siteConfig.site.url,
      images: finalOgImage ? [{ url: finalOgImage }] : undefined,
      type: ogType,
      siteName: siteConfig.site.shortName,
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: finalOgImage ? [finalOgImage] : undefined,
      creator: siteConfig.integrations.twitterHandle,
    },
    alternates: {
      canonical: alternates?.canonical ?? siteConfig.site.url,
      languages: alternates?.languages,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateArticleMetadata(article: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: Array<{ name: string; url?: string }>;
  tags?: string[];
  image?: string;
  section?: string;
  locale: string;
  alternateLocales?: string[];
}): Metadata {
  const metadata = generateSeoMetadata({
    title: article.title,
    description: article.description,
    keywords: article.tags,
    ogImage: article.image,
    ogType: "article",
    authors: article.authors,
  });

  const openGraph: ArticleOpenGraph = {
    ...metadata.openGraph,
    type: "article",
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
    authors: article.authors?.map((a) => a.name),
    tags: article.tags,
    locale: article.locale,
    alternateLocale: article.alternateLocales,
  };

  return {
    ...metadata,
    openGraph,
  };
}

export function generateProfileMetadata(profile: {
  name: string;
  description: string;
  role?: string;
  image?: string;
  locale: string;
  alternateLocales?: string[];
  socialLinks?: Record<string, string>;
}): Metadata {
  const metadata = generateSeoMetadata({
    title: `${profile.name} - ${profile.role || ""}`,
    description: profile.description,
    ogImage: profile.image,
    ogType: "profile",
  });

  const openGraph: ProfileOpenGraph = {
    ...metadata.openGraph,
    type: "profile",
    firstName: profile.name.split(" ")[0],
    lastName: profile.name.split(" ").slice(1).join(" "),
    locale: profile.locale,
    alternateLocale: profile.alternateLocales,
  };

  return {
    ...metadata,
    openGraph,
    alternates: {
      languages: profile.alternateLocales?.reduce(
        (acc, locale) => ({
          ...acc,
          [locale]: `/${locale}`,
        }),
        {},
      ),
    },
  };
}

export function generateProjectMetadata(project: {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  locale: string;
  alternateLocales?: string[];
  github?: string;
  demo?: string;
}): Metadata {
  const metadata = generateSeoMetadata({
    title: project.title,
    description: project.description,
    keywords: project.technologies,
    ogImage: project.image,
    ogType: "website",
  });

  return {
    ...metadata,
    alternates: {
      languages: project.alternateLocales?.reduce(
        (acc, locale) => ({
          ...acc,
          [locale]: `/${locale}/projects/${project.title.toLowerCase().replace(/\s+/g, "-")}`,
        }),
        {},
      ),
    },
  };
}

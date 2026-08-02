import type { Metadata } from "next";

import type { SiteConfig } from "./config-server";
import type { SiteLocale } from "./request-locale";
import type { Post } from "@/types/blog";
import { getLocalizedInstitutionalPath } from "./navigation";

const openGraphLocale = {
  pt: "pt_BR",
  en: "en_US",
} as const;

function absoluteUrl(baseUrl: string, path: string): string {
  return new URL(path, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

interface PageMetadataOptions {
  config: SiteConfig;
  path: string;
  locale: SiteLocale;
  title: string;
  description: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  config,
  path,
  locale,
  title,
  description,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const localizedPath = getLocalizedInstitutionalPath(path, locale);
  const url = absoluteUrl(config.site.url, localizedPath);
  const languages = {
    "pt-BR": absoluteUrl(
      config.site.url,
      getLocalizedInstitutionalPath(path, "pt"),
    ),
    "en-US": absoluteUrl(
      config.site.url,
      getLocalizedInstitutionalPath(path, "en"),
    ),
  };

  return {
    title,
    description,
    keywords: config.seo.keywords,
    authors: [{ name: config.site.author, url: config.site.url }],
    alternates: { canonical: url, languages },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: config.site.shortName,
      locale: openGraphLocale[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
    },
  };
}

interface BlogPostMetadataOptions {
  config: SiteConfig;
  post: Pick<
    Post,
    | "slug_pt"
    | "slug_en"
    | "title_pt"
    | "title_en"
    | "summary_pt"
    | "summary_en"
    | "publicationDate"
    | "updatedAt"
  >;
  slug: string;
}

export function buildBlogPostMetadata({
  config,
  post,
  slug,
}: BlogPostMetadataOptions): Metadata {
  const locale: SiteLocale = post.slug_pt === slug ? "pt" : "en";
  const title = locale === "pt" ? post.title_pt : post.title_en;
  const description = locale === "pt" ? post.summary_pt : post.summary_en;
  const url = absoluteUrl(config.site.url, `/blog/${slug}`);
  const languages = {
    "pt-BR": absoluteUrl(config.site.url, `/blog/${post.slug_pt}`),
    "en-US": absoluteUrl(config.site.url, `/blog/${post.slug_en}`),
  };

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: config.site.shortName,
      locale: openGraphLocale[locale],
      alternateLocale: [openGraphLocale[locale === "pt" ? "en" : "pt"]],
      type: "article",
      publishedTime: post.publicationDate,
      modifiedTime: post.updatedAt || post.publicationDate,
      authors: [config.site.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
    },
  };
}

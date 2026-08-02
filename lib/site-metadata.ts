import { Metadata } from "next";
import { getSiteConfig, type SiteConfig } from "./config-server";
import { getProfileData } from "./data";
import type { SiteLocale } from "./request-locale";
import { buildPageMetadata } from "./seo-metadata";
import { serializeJsonLd } from "./json-ld";
import { getLocalizedInstitutionalPath } from "./navigation";
import type { Profile } from "@/types/profile";

export function generateJsonLd(data: Record<string, unknown>) {
  return {
    __html: serializeJsonLd(data),
  };
}

export function generatePersonJsonLd() {
  const config = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.site.author,
    url: config.site.url,
    sameAs: [config.social.github, config.social.linkedin],
  };
}

export function generateBlogPostJsonLd({
  title,
  description,
  publishDate,
  updateDate,
  image,
  url,
}: {
  title: string;
  description: string;
  publishDate: string;
  updateDate?: string;
  image?: string;
  url: string;
}) {
  const config = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    ...(image
      ? { image: new URL(image, `${config.site.url}/`).toString() }
      : {}),
    datePublished: publishDate,
    dateModified: updateDate || publishDate,
    author: generatePersonJsonLd(),
    publisher: generatePersonJsonLd(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

// Função para gerar metadata base dinâmico
export async function generateSiteMetadata(locale: SiteLocale = "pt"): Promise<Metadata> {
  const config = getSiteConfig();
  const profile = await getProfileData();
  const currentProfile = profile?.[locale] || profile?.pt;

  const siteTitle = currentProfile?.title
    ? `${currentProfile.name} - ${currentProfile.title}`
    : config.site.title;
  const fullDescription = currentProfile?.about || config.site.description;
  // Truncate description for SEO (max ~155 chars for SERP display)
  const siteDescription = fullDescription.length > 155
    ? fullDescription.substring(0, 152) + "..."
    : fullDescription;
  const localizedHomePath = getLocalizedInstitutionalPath("/", locale);

  return {
    metadataBase: new URL(config.site.url),
    title: {
      default: siteTitle,
      template: `%s | ${config.site.shortName}`,
    },
    description: siteDescription,
    keywords: config.seo.keywords,
    authors: [{ name: config.site.author, url: config.site.url }],
    creator: config.site.author,
    publisher: config.site.author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: localizedHomePath,
      languages: {
        "pt-BR": "/",
        "en-US": "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      alternateLocale: [locale === "pt" ? "en_US" : "pt_BR"],
      url: localizedHomePath,
      title: siteTitle,
      description: siteDescription,
      siteName: config.site.shortName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
    },
    manifest: "/api/webmanifest",
  };
}

// Função para gerar metadata de página específica
export async function generatePageMetadata(
  options: {
    title: string;
    description: string;
    path: string;
    locale: SiteLocale;
    noIndex?: boolean;
  },
): Promise<Metadata> {
  const config = getSiteConfig();
  return buildPageMetadata({ config, ...options });
}

// Função para gerar structured data
export async function generateStructuredData(profileData?: Profile | null) {
  const config = getSiteConfig();
  const profile = profileData === undefined ? await getProfileData() : profileData;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.pt?.name || config.site.author,
    url: config.site.url,
    jobTitle: profile?.pt?.title || config.site.title.split(" - ")[1] || "Professional",
    sameAs: [
      config.social.github,
      config.social.linkedin,
      config.social.twitter,
      config.social.website,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: profile?.pt?.location || config.site.location,
    },
    email: config.site.email,
  };
}

// Re-export types and functions for compatibility
export type { SiteConfig };
export { getSiteConfig };

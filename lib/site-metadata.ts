import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";
import { getSiteConfig, type SiteConfig } from "./config-server";
import { buildOgImageUrl } from "./seo";
import { getProfileData } from "./data";

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

export function generateMetadata({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  noIndex = false,
  alternates,
}: GenerateMetadataOptions = {}): Metadata {
  const finalTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;

  return {
    title: finalTitle,
    description,
    openGraph: {
      title: finalTitle,
      description,
      images: [{ url: image }],
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates,
  };
}

export function generateJsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
  };
}

export function generatePersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Caio Barbieri",
    url: SITE_CONFIG.url,
    sameAs: [SITE_CONFIG.links.github, SITE_CONFIG.links.linkedin],
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
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image || SITE_CONFIG.ogImage,
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
export async function generateSiteMetadata(): Promise<Metadata> {
  const config = getSiteConfig();
  const profile = await getProfileData();

  const siteTitle = profile?.pt?.title ? `${profile.pt.name} - ${profile.pt.title}` : config.site.title;
  const siteDescription = profile?.pt?.about || config.site.description;

  return {
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
      canonical: config.site.url,
      languages: {
        "pt-BR": `${config.site.url}/pt`,
        "en-US": `${config.site.url}/en`,
        "es-ES": `${config.site.url}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: config.site.url,
      title: siteTitle,
      description: siteDescription,
      siteName: config.site.shortName,
      images: [
        {
          url: buildOgImageUrl({ title: config.site.shortName }),
          width: 1200,
          height: 630,
          alt: config.site.shortName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
      images: [buildOgImageUrl({ title: config.site.shortName })],
    },
    manifest: `${config.site.url}/api/webmanifest`,
  };
}

// Função para gerar metadata de página específica
export async function generatePageMetadata(
  title: string,
  description?: string,
  image?: string,
  noIndex?: boolean
): Promise<Metadata> {
  const config = getSiteConfig();
  const profile = await getProfileData();
  const pageDescription = description || profile?.pt?.about || config.site.description;
  const pageImage = image || buildOgImageUrl({ title });

  return {
    title,
    description: pageDescription,
    keywords: config.seo.keywords,
    authors: [{ name: config.site.author, url: config.site.url }],
    robots: noIndex ? "noindex,nofollow" : undefined,
    openGraph: {
      title,
      description: pageDescription,
      url: config.site.url,
      siteName: config.site.shortName,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
      images: [pageImage],
    },
  };
}

// Função para gerar structured data
export async function generateStructuredData() {
  const config = getSiteConfig();
  const profile = await getProfileData();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.pt?.name || config.site.author,
    url: config.site.url,
    jobTitle: profile?.pt?.title || config.site.title.split(" - ")[1] || "Professional",
    worksFor: {
      "@type": "Organization",
      name: config.site.shortName,
    },
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

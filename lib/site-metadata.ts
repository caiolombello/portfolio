import { Metadata } from "next";
import { getSiteConfig, type SiteConfig } from "./config-server";
import { getProfileData } from "./data";

export function generateJsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
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
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    ...(image ? { image } : {}),
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
  const fullDescription = profile?.pt?.about || config.site.description;
  // Truncate description for SEO (max ~155 chars for SERP display)
  const siteDescription = fullDescription.length > 155
    ? fullDescription.substring(0, 152) + "..."
    : fullDescription;

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
      canonical: config.site.url,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: config.site.url,
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
  title: string,
  description?: string,
  image?: string,
  noIndex?: boolean
): Promise<Metadata> {
  const config = getSiteConfig();
  const profile = await getProfileData();
  const pageDescription = description || profile?.pt?.about || config.site.description;

  let pageImage: string;
  if (image) {
    pageImage = image.startsWith('http') ? image : `${config.site.url}${image}`;
  } else if (config.og?.strategy === 'static' && config.og.image) {
    pageImage = `${config.site.url}${config.og.image}`;
  } else {
    const ogUrl = new URL("/api/og", config.site.url);
    ogUrl.searchParams.set("title", title);
    pageImage = ogUrl.toString();
  }

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

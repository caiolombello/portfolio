import type { NewsletterIssueSummary } from "./newsletter";
import { getLocalizedInstitutionalPath } from "./navigation";
import type { SiteLocale } from "./request-locale";

interface NewsletterSeoCopy {
  title: string;
  description: string;
  image: {
    alt: string;
    eyebrow: string;
    title: string;
    description: string;
    tags: string[];
  };
}

const newsletterSeoCopy: Record<SiteLocale, NewsletterSeoCopy> = {
  pt: {
    title: "Radar de Produção — newsletter de DevOps, SRE e Cloud",
    description:
      "Newsletter semanal sobre DevOps, SRE, AWS, Kubernetes, observabilidade e IA, explicada pelo impacto real em produção.",
    image: {
      alt: "Radar de Produção — newsletter de DevOps, SRE e Cloud",
      eyebrow: "Radar de Produção",
      title: "O sinal que importa quando o software encontra produção.",
      description:
        "DevOps, SRE, AWS, Kubernetes, observabilidade e IA — com impacto, evidência e uma ação concreta.",
      tags: ["AWS", "Kubernetes", "SRE", "Observabilidade"],
    },
  },
  en: {
    title: "Radar de Produção — DevOps, SRE & Cloud newsletter",
    description:
      "A weekly newsletter about DevOps, SRE, AWS, Kubernetes, observability, and AI, explained through real production impact.",
    image: {
      alt: "Radar de Produção — DevOps, SRE and Cloud newsletter",
      eyebrow: "Production Radar",
      title: "The signal that matters when software meets production.",
      description:
        "DevOps, SRE, AWS, Kubernetes, observability, and AI — with impact, evidence, and one concrete action.",
      tags: ["AWS", "Kubernetes", "SRE", "Observability"],
    },
  },
};

export function getNewsletterSeoCopy(locale: SiteLocale): NewsletterSeoCopy {
  return newsletterSeoCopy[locale];
}

export function buildNewsletterCollectionJsonLd({
  baseUrl,
  locale,
  issues,
}: {
  baseUrl: string;
  locale: SiteLocale;
  issues: NewsletterIssueSummary[];
}): Record<string, unknown> | null {
  if (issues.length === 0) return null;

  const copy = getNewsletterSeoCopy(locale);
  const collectionPath = getLocalizedInstitutionalPath("/newsletter", locale);
  const collectionUrl = new URL(collectionPath, `${baseUrl}/`).toString();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": collectionUrl,
    name: copy.title,
    description: copy.description,
    url: collectionUrl,
    inLanguage: locale === "pt" ? "pt-BR" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      url: new URL("/", `${baseUrl}/`).toString(),
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: issues.length,
      itemListElement: issues.map((issue, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: new URL(
          `/newsletter/${encodeURIComponent(issue.issue_id)}`,
          `${baseUrl}/`,
        ).toString(),
        name: issue.title,
        description: issue.preheader,
      })),
    },
  };
}

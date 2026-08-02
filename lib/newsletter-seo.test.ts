import { describe, expect, it } from "vitest";

import {
  buildNewsletterCollectionJsonLd,
  getNewsletterSeoCopy,
} from "./newsletter-seo";

describe("newsletter SEO", () => {
  it("uses copy that is genuinely localized for the English Open Graph image", () => {
    const english = getNewsletterSeoCopy("en");

    expect(english.title).toBe(
      "Radar de Produção — DevOps, SRE & Cloud newsletter",
    );
    expect(english.image.alt).toBe(
      "Radar de Produção — DevOps, SRE and Cloud newsletter",
    );
    expect(english.image.title).toBe(
      "The signal that matters when software meets production.",
    );
  });

  it("does not describe an unpublished archive as a collection", () => {
    expect(
      buildNewsletterCollectionJsonLd({
        baseUrl: "https://caio.lombello.com",
        locale: "pt",
        issues: [],
      }),
    ).toBeNull();
  });

  it("publishes an ItemList pointing to canonical issue pages", () => {
    const structuredData = buildNewsletterCollectionJsonLd({
      baseUrl: "https://caio.lombello.com/",
      locale: "pt",
      issues: [
        {
          issue_id: "2026-W31",
          title: "Radar de Produção — Semana 31/2026",
          preheader: "Mudanças importantes para quem opera produção.",
        },
      ],
    });

    expect(structuredData).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://caio.lombello.com/newsletter",
      inLanguage: "pt-BR",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 1,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            url: "https://caio.lombello.com/newsletter/2026-W31",
            name: "Radar de Produção — Semana 31/2026",
            description: "Mudanças importantes para quem opera produção.",
          },
        ],
      },
    });
  });
});

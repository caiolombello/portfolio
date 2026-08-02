import { describe, expect, it } from "vitest";

import { buildRobots, buildSitemap } from "./seo-routes";

describe("SEO metadata routes", () => {
  it("allows crawlers to fetch Next.js rendering assets", () => {
    const metadata = buildRobots("https://caio.lombello.com");
    const rules = Array.isArray(metadata.rules) ? metadata.rules : [metadata.rules];
    const disallowed = rules.flatMap((rule) =>
      Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow],
    );

    expect(disallowed).not.toContain("/_next/");
  });

  it("omits fabricated modification dates from static pages", async () => {
    const entries = buildSitemap({
      baseUrl: "https://caio.lombello.com",
      portfolioEnabled: false,
      posts: [
        {
          slug_pt: "kubernetes-hpa-custom-metrics.pt",
          slug_en: "kubernetes-hpa-custom-metrics.en",
          publicationDate: "2023-03-18",
          updatedAt: "2026-08-01",
        },
      ],
      projects: [],
    });
    const resume = entries.find(({ url }) => url.endsWith("/resume"));
    const post = entries.find(({ url }) =>
      url.endsWith("kubernetes-hpa-custom-metrics.pt"),
    );

    expect(resume?.lastModified).toBeUndefined();
    expect(post?.lastModified).toEqual(new Date("2026-08-01"));
    expect(entries.map(({ url }) => url)).toEqual(
      expect.arrayContaining([
        "https://caio.lombello.com/en",
        "https://caio.lombello.com/en/resume",
        "https://caio.lombello.com/en/blog",
        "https://caio.lombello.com/en/contact",
      ]),
    );
  });
});

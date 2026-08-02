import { describe, expect, it } from "vitest";
import {
  getLocalizedInstitutionalPath,
  getMainNavigationItems,
} from "./navigation";

const translate = (key: string) => key;

describe("getMainNavigationItems", () => {
  it("omits the portfolio entry while the portfolio feature is disabled", () => {
    const items = getMainNavigationItems(translate, {
      portfolioEnabled: false,
    });

    expect(items.map(({ href }) => href)).toEqual([
      "/",
      "/resume",
      "/blog",
      "/newsletter",
      "/contact",
    ]);
  });

  it("keeps the portfolio entry available for future publication", () => {
    const items = getMainNavigationItems(translate, {
      portfolioEnabled: true,
    });

    expect(items.map(({ href }) => href)).toContain("/portfolio");
  });

  it("points English navigation to dedicated URLs", () => {
    const items = getMainNavigationItems(
      translate,
      { portfolioEnabled: false },
      "en",
    );

    expect(items.map(({ href }) => href)).toEqual([
      "/en",
      "/en/resume",
      "/en/blog",
      "/en/newsletter",
      "/en/contact",
    ]);
  });
});

describe("getLocalizedInstitutionalPath", () => {
  it("switches between the Portuguese and English institutional URLs", () => {
    expect(getLocalizedInstitutionalPath("/resume", "en")).toBe("/en/resume");
    expect(getLocalizedInstitutionalPath("/en/contact", "pt")).toBe("/contact");
    expect(getLocalizedInstitutionalPath("/en", "pt")).toBe("/");
    expect(getLocalizedInstitutionalPath("/newsletter", "en")).toBe(
      "/en/newsletter",
    );
  });

  it("keeps localized blog post slugs unchanged", () => {
    expect(getLocalizedInstitutionalPath("/blog/kubernetes-hpa.en", "en")).toBe(
      "/blog/kubernetes-hpa.en",
    );
  });
});

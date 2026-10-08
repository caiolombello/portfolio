import { describe, expect, it } from "vitest";

import { detectRequestLocale } from "./request-locale";

describe("detectRequestLocale", () => {
  it("uses the language encoded in a localized blog slug", () => {
    expect(
      detectRequestLocale("/blog/kubernetes-hpa-custom-metrics.en", "pt"),
    ).toBe("en");
    expect(
      detectRequestLocale("/blog/kubernetes-hpa-custom-metrics.pt", "en"),
    ).toBe("pt");
  });

  it("falls back to the supported locale cookie", () => {
    expect(detectRequestLocale("/en/resume", "pt")).toBe("en");
    expect(detectRequestLocale("/resume", "en")).toBe("pt");
    expect(detectRequestLocale("/resume", "es")).toBe("pt");
  });

  it("uses project detail URLs as the source of truth even without a locale cookie", () => {
    expect(detectRequestLocale("/portfolio/falatrace", "en")).toBe("pt");
    expect(detectRequestLocale("/portfolio/falatrace", "pt")).toBe("pt");
    expect(detectRequestLocale("/en/portfolio/falatrace")).toBe("en");
    expect(detectRequestLocale("/en/portfolio/falatrace", "pt")).toBe("en");
    expect(detectRequestLocale("/portfolio", "en")).toBe("pt");
    expect(detectRequestLocale("/en/portfolio", "pt")).toBe("en");
  });
});

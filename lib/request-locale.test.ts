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
});

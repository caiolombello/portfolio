import { describe, expect, it } from "vitest";
import { isPortfolioEnabled } from "./site-features";

describe("isPortfolioEnabled", () => {
  it("disables public portfolio surfaces only when explicitly configured", () => {
    expect(isPortfolioEnabled({ features: { portfolio: false } })).toBe(false);
    expect(isPortfolioEnabled({ features: { portfolio: true } })).toBe(true);
    expect(isPortfolioEnabled({})).toBe(true);
  });
});

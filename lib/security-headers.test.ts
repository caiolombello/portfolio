import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS } from "./security-headers.mjs";

const headers = Object.fromEntries(
  SECURITY_HEADERS.map(({ key, value }) => [key, value]),
);

describe("security headers", () => {
  it("does not grant cross-origin access globally", () => {
    expect(headers["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(headers["Access-Control-Allow-Methods"]).toBeUndefined();
  });

  it("ships a report-only CSP for the site's explicit integrations", () => {
    const csp = headers["Content-Security-Policy-Report-Only"];

    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("https://challenges.cloudflare.com");
    expect(csp).toContain("https://formspree.io");
    expect(csp).toContain("https://giscus.app");
    expect(csp).toContain("https://*.vercel-insights.com");
  });

  it("disables browser capabilities the portfolio does not use", () => {
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["Permissions-Policy"]).toContain("microphone=()");
    expect(headers["Permissions-Policy"]).toContain("geolocation=()");
  });
});

import { describe, expect, it } from "vitest";

import { parseNewsletterIssue } from "./newsletter";
import {
  cveBadges,
  cveScoreLabel,
  cveShortDate,
  parseCveSection,
} from "./newsletter-cve";

const cveItem = {
  cve_id: "CVE-2026-12345",
  url: "https://cve.now/CVE-2026-12345",
  title: "Escape de contêiner no runc",
  product: "runc",
  cvss: 9.8,
  severity: "Crítica",
  kev: true,
  actively_exploited: true,
  public_exploit: false,
  poc: true,
  date: "2026-10-28",
  event: "Adicionada ao CISA KEV",
  summary: "Permite escapar do contêiner para o host.",
};

const issue = {
  issue_id: "2026-W44",
  title: "Radar de Produção — Semana 44/2026",
  preheader: "Mudanças importantes.",
  introduction: "Resumo semanal.",
  quick_summary: ["Um", "Dois", "Três"],
  action_of_the_week: "Revise seus clusters.",
  items: [
    {
      item_id: "item-1",
      headline: "Uma mudança operacional",
      summary: "Resumo da mudança.",
      why_it_matters: "Impacto em produção.",
      recommended_action: "Revise a configuração.",
      canonical_url: "https://kubernetes.io/blog/release",
      category: "kubernetes_cloud_native",
      published_at: "2026-10-28T10:00:00+00:00",
      claims: [],
    },
  ],
};

const okSection = {
  status: "ok",
  window_start: "2026-10-26",
  window_end: "2026-11-02",
  items: [cveItem],
};

describe("CVE section payload", () => {
  it("keeps issues without the field exactly as before", () => {
    expect(parseNewsletterIssue(issue).cve_section).toBeNull();
    expect(parseCveSection(undefined)).toBeNull();
  });

  it("accepts the section published by the backend", () => {
    const parsed = parseNewsletterIssue({ ...issue, cve_section: okSection });
    expect(parsed.cve_section).toEqual({
      status: "ok",
      windowEnd: "2026-11-02",
      items: [cveItem],
    });
  });

  it("accepts the empty and unavailable states", () => {
    expect(
      parseCveSection({ status: "empty", window_end: null, items: [] }),
    ).toMatchObject({ status: "empty", items: [] });
    expect(parseCveSection({ status: "unavailable", items: [] })).toMatchObject(
      { status: "unavailable", items: [] },
    );
  });

  it.each([
    ["null", null],
    ["a string", "oops"],
    ["an unknown status", { status: "partial", items: [] }],
    ["ok without items", { status: "ok", items: [] }],
    ["empty with items", { status: "empty", items: [cveItem] }],
    [
      "a malformed ID",
      { ...okSection, items: [{ ...cveItem, cve_id: "CVE-1" }] },
    ],
    [
      "a link outside cve.now",
      {
        ...okSection,
        items: [{ ...cveItem, url: "https://evil.example/CVE-2026-12345" }],
      },
    ],
    [
      "a CVSS out of range",
      { ...okSection, items: [{ ...cveItem, cvss: 11 }] },
    ],
    [
      "an impossible date",
      { ...okSection, items: [{ ...cveItem, date: "2026-02-31" }] },
    ],
    ["too many items", { ...okSection, items: Array(9).fill(cveItem) }],
  ])(
    "falls back to unavailable on %s without breaking the issue",
    (_, value) => {
      const parsed = parseNewsletterIssue({ ...issue, cve_section: value });
      expect(parsed.items).toHaveLength(1);
      expect(parsed.cve_section).toEqual({
        status: "unavailable",
        windowEnd: null,
        items: [],
      });
    },
  );

  it("ignores unexpected extra fields", () => {
    const parsed = parseCveSection({
      ...okSection,
      extra: true,
      items: [{ ...cveItem, extra: "<script>" }],
    });
    expect(parsed?.items[0]).toEqual(cveItem);
  });
});

describe("CVE item labels", () => {
  it("derives badges like the email", () => {
    expect(cveBadges(cveItem)).toEqual(["KEV", "PoC"]);
    expect(cveBadges({ ...cveItem, kev: false, public_exploit: true })).toEqual(
      ["Exploração ativa", "Exploit público"],
    );
    expect(
      cveBadges({
        ...cveItem,
        kev: false,
        actively_exploited: false,
        poc: false,
      }),
    ).toEqual([]);
  });

  it("formats the score and severity", () => {
    expect(cveScoreLabel(cveItem)).toBe("CVSS 9.8 (Crítica)");
    expect(cveScoreLabel({ ...cveItem, cvss: 8, severity: "" })).toBe(
      "CVSS 8.0",
    );
    expect(cveScoreLabel({ ...cveItem, cvss: null })).toBe(
      "Severidade crítica",
    );
    expect(cveScoreLabel({ ...cveItem, cvss: null, severity: "" })).toBeNull();
  });

  it("omits the year only when it matches the edition", () => {
    expect(cveShortDate("2026-10-28", "2026-11-02")).toBe("28 out");
    expect(cveShortDate("2025-12-30", "2026-01-04")).toBe("30 dez 2025");
    expect(cveShortDate("2026-10-28", null)).toBe("28 out 2026");
  });
});

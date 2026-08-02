import { describe, expect, it } from "vitest";

import {
  buildNewsletterApiEndpoint,
  parseNewsletterArchive,
  parseNewsletterIssue,
} from "./newsletter";

describe("newsletter API contracts", () => {
  it("normalizes the API base URL without duplicating separators", () => {
    expect(
      buildNewsletterApiEndpoint(
        "https://example.execute-api.us-east-1.amazonaws.com/",
        "/issues",
      ),
    ).toBe("https://example.execute-api.us-east-1.amazonaws.com/issues");
  });

  it("accepts a minimal published archive and rejects malformed records", () => {
    expect(
      parseNewsletterArchive({
        issues: [
          {
            issue_id: "2026-W31",
            title: "Radar de Produção — Semana 31/2026",
            preheader: "Mudanças importantes.",
          },
        ],
      }),
    ).toHaveLength(1);

    expect(() =>
      parseNewsletterArchive({
        issues: [{ issue_id: "week-31", title: "Invalid" }],
      }),
    ).toThrow();
  });

  it("accepts only HTTPS source links in a published issue", () => {
    const issue = {
      issue_id: "2026-W31",
      title: "Radar de Produção — Semana 31/2026",
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
          published_at: "2026-08-01T10:00:00+00:00",
          claims: [],
        },
      ],
    };

    expect(parseNewsletterIssue(issue).items).toHaveLength(1);
    expect(() =>
      parseNewsletterIssue({
        ...issue,
        items: [{ ...issue.items[0], canonical_url: "http://example.com" }],
      }),
    ).toThrow();
  });
});

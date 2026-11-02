// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import NewsletterIssuePage from "./page";

const cveItem = {
  cve_id: "CVE-2026-12345",
  url: "https://cve.now/CVE-2026-12345",
  title: "Escape de contêiner no runc <img src=x onerror=alert(1)>",
  product: "runc",
  cvss: 9.8,
  severity: "Crítica",
  kev: true,
  actively_exploited: true,
  public_exploit: true,
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

async function renderIssue(payload: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(payload), { status: 200 })),
  );
  const page = await NewsletterIssuePage({
    params: Promise.resolve({ issueId: "2026-W44" }),
  });
  return render(page);
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("NewsletterIssuePage CVE section", () => {
  it("renders older issues without the section", async () => {
    const { container } = await renderIssue(issue);

    expect(
      screen.queryByRole("heading", { name: "CVEs da semana" }),
    ).toBeNull();
    expect(container.textContent).not.toContain("cve.now");
    expect(
      screen.getByRole("heading", { name: "Em 30 segundos" }),
    ).not.toBeNull();
  });

  it("renders the items between the introduction and the editorial sections", async () => {
    const { container } = await renderIssue({
      ...issue,
      cve_section: {
        status: "ok",
        window_start: "2026-10-26",
        window_end: "2026-11-02",
        items: [cveItem],
      },
    });

    const section = screen
      .getByRole("heading", { name: "CVEs da semana" })
      .closest("section") as HTMLElement;
    const headings = Array.from(container.querySelectorAll("h2")).map(
      (heading) => heading.textContent,
    );
    expect(headings.indexOf("CVEs da semana")).toBe(0);
    expect(headings.indexOf("Em 30 segundos")).toBe(1);

    const link = within(section).getByRole("link", { name: "CVE-2026-12345" });
    expect(link.getAttribute("href")).toBe("https://cve.now/CVE-2026-12345");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("target")).toBe("_blank");

    expect(section.textContent).toContain("runc");
    expect(section.textContent).toContain("CVSS 9.8 (Crítica)");
    expect(section.textContent).toContain("28 out");
    expect(within(section).getByText("KEV")).not.toBeNull();
    expect(within(section).getByText("Exploit público")).not.toBeNull();
    expect(within(section).queryByText("PoC")).toBeNull();
    expect(within(section).getByText("Adicionada ao CISA KEV")).not.toBeNull();
    expect(
      within(section).getByText("Permite escapar do contêiner para o host."),
    ).not.toBeNull();
    // Text from the payload is escaped, never parsed as markup.
    expect(within(section).getByRole("heading", { level: 3 }).textContent).toBe(
      cveItem.title,
    );
    expect(section.querySelector("img")).toBeNull();

    expect(section.textContent).toContain("Fonte: cve.now (resumos CC-BY 4.0)");
    const source = within(section).getByRole("link", { name: "cve.now" });
    expect(source.getAttribute("rel")).toContain("noopener");
  });

  it("renders the empty state", async () => {
    await renderIssue({
      ...issue,
      cve_section: { status: "empty", window_end: "2026-11-02", items: [] },
    });

    expect(
      screen.getByText(
        "Nenhuma CVE crítica relevante para cloud, Linux ou Kubernetes nesta semana.",
      ),
    ).not.toBeNull();
  });

  it("renders the unavailable state, also for a malformed section", async () => {
    const message =
      "A fonte de CVEs (cve.now) ficou indisponível nesta semana; a seção volta na próxima edição.";

    await renderIssue({
      ...issue,
      cve_section: { status: "unavailable", items: [] },
    });
    expect(screen.getByText(message)).not.toBeNull();
    cleanup();

    await renderIssue({ ...issue, cve_section: { status: "ok", items: "?" } });
    expect(screen.getByText(message)).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: "Uma mudança operacional" }),
    ).not.toBeNull();
  });
});

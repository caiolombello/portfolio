import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getProjects } from "./site-data";

describe("localized project navigation", () => {
  it("keeps the English project journey in English without relying on cookies", async () => {
    const projects = await getProjects("en");
    expect(
      projects.every((project) => project.href.startsWith("/en/portfolio/")),
    ).toBe(true);
    expect(
      projects.find((project) => project.id === "radar-de-producao")?.liveUrl,
    ).toBe("/en/newsletter");
    expect(
      projects.find((project) => project.id === "falatrace")?.liveUrl,
    ).toBe("https://caiolombello.github.io/falatrace/");
  });

  it("preserves the existing Portuguese project and newsletter URLs", async () => {
    const projects = await getProjects("pt");
    expect(
      projects.every((project) => project.href.startsWith("/portfolio/")),
    ).toBe(true);
    expect(
      projects.find((project) => project.id === "radar-de-producao")?.liveUrl,
    ).toBe("/newsletter");
  });
});

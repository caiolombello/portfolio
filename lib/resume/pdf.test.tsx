import { describe, expect, it } from "vitest";
import type { ResumeModel } from "./model";
import { renderResumePdf } from "./pdf";

const model: ResumeModel = {
  locale: "pt",
  personalInfo: {
    name: "Caio Teste",
    title: "Engenheiro DevOps",
    location: "Campinas, Brasil",
    email: "caio@example.com",
    phone: "+55 19 99999-9999",
    linkedin: "https://linkedin.com/in/caio",
    github: "https://github.com/caio",
  },
  summary: "Arquitetura, confiabilidade e automação de plataformas.",
  experiences: [
    {
      company: "OpsTeam",
      title: "SRE",
      period: "2025 - Presente",
      responsibilities: ["Mantenho ambientes críticos confiáveis."],
    },
  ],
  education: [
    {
      institution: "Universidade",
      degree: "Bacharelado",
      period: "2022 - 2025",
    },
  ],
  skills: [],
  skillGroups: [{ category: "Cloud/Infra", items: ["AWS", "Kubernetes"] }],
  labels: {
    about: "Sobre",
    experience: "Experiência Profissional",
    education: "Educação",
    skills: "Habilidades",
  },
};

describe("renderResumePdf", () => {
  it("renders a non-empty PDF document from the shared resume model", async () => {
    const pdf = await renderResumePdf(model);

    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(2_000);
  });
});

import { describe, expect, it } from "vitest";
import { buildResumeModels } from "./model";

const source = {
  profile: {
    pt: {
      name: "Caio Teste",
      title: "Engenheiro DevOps",
      location: "Campinas, Brasil",
      about: "Resumo em português.",
    },
    en: {
      name: "Caio Test",
      title: "DevOps Engineer",
      location: "Campinas, Brazil",
      about: "English summary.",
    },
    email: "caio@example.com",
    phone: "+55 19 99999-9999",
    socialLinks: {
      linkedin: "https://linkedin.com/in/caio",
      github: "https://github.com/caio",
    },
  },
  experiences: [
    {
      company: "Empresa antiga",
      title_pt: "Cargo antigo",
      title_en: "Previous role",
      period: "2022 - 2024",
      startDate: "2022-01-01",
      responsibilities_pt: [{ item: "Responsabilidade antiga." }],
      responsibilities_en: [{ item: "Previous responsibility." }],
    },
    {
      company: "Empresa atual",
      title_pt: "Cargo atual",
      title_en: "Current role",
      period: "2025 - Presente",
      startDate: "2025-01-01",
      responsibilities_pt: [{ item: "Responsabilidade atual." }],
      responsibilities_en: [{ item: "Current responsibility." }],
    },
  ],
  education: [
    {
      institution: "Universidade",
      degree_pt: "Bacharelado",
      degree_en: "Bachelor's degree",
      period: "2022 - 2025",
      startDate: "2022-03-01",
      endDate: "2025-12",
    },
  ],
  skills: [
    { name: "AWS", category: "Cloud/Infra", level: "Avançado" },
    { name: "Vault", category: "Segurança", level: "Experiente" },
  ],
};

describe("buildResumeModels", () => {
  it("includes localized languages and keeps certifications separate from training badges", () => {
    const models = buildResumeModels({
      ...source,
      profile: {
        ...source.profile,
        languages: [
          {
            name_pt: "Inglês",
            name_en: "English",
            level_pt: "Proficiência profissional",
            level_en: "Professional proficiency",
          },
        ],
      },
      certifications: [
        {
          name: "AWS Certified Security – Specialty",
          issuer: "Amazon Web Services",
          issuedAt: "2026-07-27",
          url: "https://example.com/security",
        },
      ],
      trainingBadges: [
        {
          name: "Introduction to GitOps",
          issuer: "The Linux Foundation",
          issuedAt: "2023-08-17",
        },
      ],
    });

    expect(models.pt.languages).toEqual([
      { name: "Inglês", level: "Proficiência profissional" },
    ]);
    expect(models.en.languages).toEqual([
      { name: "English", level: "Professional proficiency" },
    ]);
    expect(models.en.certifications.map((item) => item.name)).toEqual([
      "AWS Certified Security – Specialty",
    ]);
    expect(models.pt.trainingBadges.map((item) => item.name)).toEqual([
      "Introduction to GitOps",
    ]);
    expect(models.en.labels.certifications).toBe("Certifications");
  });

  it("translates the approved skill categories and names without requiring proficiency levels", () => {
    const models = buildResumeModels({
      ...source,
      skills: [
        { name: "AWS", category: "Cloud e infraestrutura" },
        { name: "Kubernetes", category: "Containers e IaC" },
        { name: "GitOps", category: "Entrega e plataformas" },
        {
          name: "Segmentação de rede",
          name_en: "Network segmentation",
          category: "Segurança",
        },
      ],
    });

    expect(models.en.skillGroups).toEqual([
      { category: "Cloud and infrastructure", items: ["AWS"] },
      { category: "Containers and IaC", items: ["Kubernetes"] },
      { category: "Delivery and platforms", items: ["GitOps"] },
      { category: "Security", items: ["Network segmentation"] },
    ]);
    expect(models.pt.skillGroups[3].items).toEqual(["Segmentação de rede"]);
  });

  it("accepts existing sources without credentials or languages", () => {
    const models = buildResumeModels(source);
    expect(models.pt.certifications).toEqual([]);
    expect(models.en.trainingBadges).toEqual([]);
    expect(models.pt.languages).toEqual([]);
  });

  it("builds sorted and localized resumes from one validated source", () => {
    const models = buildResumeModels(source);

    expect(models.pt.summary).toBe("Resumo em português.");
    expect(models.en.summary).toBe("English summary.");
    expect(models.pt.experiences.map((item) => item.company)).toEqual([
      "Empresa atual",
      "Empresa antiga",
    ]);
    expect(models.en.experiences[0].title).toBe("Current role");
    expect(models.pt.experiences[0].period).toBe("jan 2025 – atual");
    expect(models.en.experiences[0].period).toBe("Jan 2025 – Present");
    expect(models.pt.education[0].period).toBe("mar 2022 – dez 2025");
    expect(models.en.education[0].period).toBe("Mar 2022 – Dec 2025");
    expect(models.en.skillGroups).toEqual([
      { category: "Cloud/Infra", items: ["AWS"] },
      { category: "Security", items: ["Vault"] },
    ]);
    expect(models.pt.personalInfo.linkedin).toBe(
      "https://linkedin.com/in/caio",
    );
  });
});

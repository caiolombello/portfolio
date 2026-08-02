import { describe, expect, it } from "vitest";
import type { ResumeModel } from "./model";
import { renderResumeMarkdown } from "./markdown";

const model: ResumeModel = {
  locale: "en",
  personalInfo: {
    name: "Caio Test",
    title: "Senior DevOps Engineer",
    location: "Campinas, Brazil",
    email: "caio@example.com",
    phone: "+55 19 99999-9999",
    linkedin: "https://linkedin.com/in/caio",
    github: "https://github.com/caio",
  },
  summary: "Cloud & Platform Engineering specialist.",
  experiences: [
    {
      company: "OpsTeam",
      title: "SRE",
      period: "2025 - Present",
      responsibilities: ["Keeps production reliable."],
    },
  ],
  education: [
    {
      institution: "University",
      degree: "Bachelor's degree",
      period: "2022 - 2025",
    },
  ],
  skills: [],
  skillGroups: [
    { category: "Security", items: ["IAM & Cloud Security", "Vault"] },
  ],
  labels: {
    about: "About",
    experience: "Professional Experience",
    education: "Education",
    skills: "Skills",
  },
};

describe("renderResumeMarkdown", () => {
  it("renders an ATS-friendly document without HTML-escaping its content", () => {
    const markdown = renderResumeMarkdown(model);

    expect(markdown).toContain("# Caio Test");
    expect(markdown).toContain("Cloud & Platform Engineering specialist.");
    expect(markdown).toContain("### SRE — OpsTeam");
    expect(markdown).toContain("- Keeps production reliable.");
    expect(markdown).toContain("- **Security:** IAM & Cloud Security, Vault");
    expect(markdown).not.toContain("&amp;");
    expect(markdown).not.toContain("undefined");
  });
});

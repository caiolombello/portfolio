import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateResumeArtifacts } from "./generate";
import type { ResumeLocale, ResumeModel, ResumeModels } from "./model";

const temporaryDirectories: string[] = [];

function createModel(locale: ResumeLocale): ResumeModel {
  const isPortuguese = locale === "pt";

  return {
    locale,
    personalInfo: {
      name: "Caio Teste",
      title: isPortuguese ? "Engenheiro DevOps" : "DevOps Engineer",
      location: isPortuguese ? "Campinas, Brasil" : "Campinas, Brazil",
      email: "caio@example.com",
      phone: "",
      linkedin: "",
      github: "",
    },
    summary: isPortuguese ? "Resumo profissional." : "Professional summary.",
    experiences: [],
    education: [],
    skills: [],
    skillGroups: [],
    labels: {
      about: isPortuguese ? "Sobre" : "About",
      experience: isPortuguese
        ? "Experiência Profissional"
        : "Professional Experience",
      education: isPortuguese ? "Educação" : "Education",
      skills: isPortuguese ? "Habilidades" : "Skills",
    },
  };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("generateResumeArtifacts", () => {
  it("writes current Portuguese and English PDF and Markdown downloads", async () => {
    const outputDirectory = fs.mkdtempSync(
      path.join(os.tmpdir(), "portfolio-resume-"),
    );
    temporaryDirectories.push(outputDirectory);
    const models: ResumeModels = {
      pt: createModel("pt"),
      en: createModel("en"),
    };

    await generateResumeArtifacts(models, outputDirectory);

    expect(
      fs.readFileSync(path.join(outputDirectory, "curriculo.md"), "utf8"),
    ).toContain("Resumo profissional.");
    expect(
      fs.readFileSync(path.join(outputDirectory, "resume.md"), "utf8"),
    ).toContain("Professional summary.");
    expect(
      fs
        .readFileSync(path.join(outputDirectory, "curriculo.pdf"))
        .subarray(0, 5)
        .toString("ascii"),
    ).toBe("%PDF-");
    expect(
      fs
        .readFileSync(path.join(outputDirectory, "resume.pdf"))
        .subarray(0, 5)
        .toString("ascii"),
    ).toBe("%PDF-");
  });
});

import { describe, expect, it } from "vitest";
import { ProjectSchema, SkillSchema } from "./validation";

describe("ProjectSchema", () => {
  it("accepts an optional localized case study without breaking legacy projects", () => {
    const project = ProjectSchema.parse({
      id: "platform",
      title_pt: "Plataforma",
      title_en: "Platform",
      shortDescription_pt: "Resumo",
      shortDescription_en: "Summary",
      description_pt: "Descrição",
      description_en: "Description",
      caseStudy: {
        role_pt: "Papel",
        role_en: "Role",
        outcomes_pt: ["Resultado"],
        outcomes_en: ["Outcome"],
      },
    });

    expect(project.caseStudy?.outcomes_en).toEqual(["Outcome"]);
    expect(
      ProjectSchema.parse({
        id: "legacy",
        title_pt: "Legado",
        title_en: "Legacy",
        shortDescription_pt: "Resumo",
        shortDescription_en: "Summary",
        description_pt: "Descrição",
        description_en: "Description",
      }).caseStudy,
    ).toBeUndefined();
  });
});

describe("redesign content", () => {
  it("accepts the newsletter's local project link and rejects protocol-relative URLs", () => {
    const project = {
      id: "radar",
      title_pt: "Radar",
      title_en: "Radar",
      shortDescription_pt: "Resumo",
      shortDescription_en: "Summary",
      description_pt: "Descrição",
      description_en: "Description",
    };
    expect(
      ProjectSchema.parse({ ...project, liveUrl: "/newsletter" }).liveUrl,
    ).toBe("/newsletter");
    expect(
      ProjectSchema.safeParse({ ...project, liveUrl: "//example.com" }).success,
    ).toBe(false);
  });

  it("accepts resume skills without inventing a proficiency level", () => {
    const skill = SkillSchema.parse({
      name: "AWS",
      name_en: "AWS",
      category: "Cloud e infraestrutura",
    });
    expect(skill.level).toBeUndefined();
    expect(skill.category).toBe("Cloud e infraestrutura");
  });
});

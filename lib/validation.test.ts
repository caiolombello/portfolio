import { describe, expect, it } from "vitest";
import { ProjectSchema } from "./validation";

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
    expect(ProjectSchema.parse({
      id: "legacy",
      title_pt: "Legado",
      title_en: "Legacy",
      shortDescription_pt: "Resumo",
      shortDescription_en: "Summary",
      description_pt: "Descrição",
      description_en: "Description",
    }).caseStudy).toBeUndefined();
  });
});

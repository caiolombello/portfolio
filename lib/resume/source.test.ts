import { describe, expect, it } from "vitest";
import { renderResumeMarkdown } from "./markdown";
import { loadResumeModels } from "./source";

describe("loadResumeModels", () => {
  it("includes approved credentials and localized languages in both downloads", () => {
    const models = loadResumeModels();
    const portuguese = renderResumeMarkdown(models.pt);
    const english = renderResumeMarkdown(models.en);

    expect(models.pt.certifications).toHaveLength(3);
    expect(models.en.trainingBadges).toHaveLength(2);
    for (const markdown of [portuguese, english]) {
      expect(markdown).toContain("AWS Certified Security – Specialty");
      expect(markdown).toContain(
        "AWS Certified Solutions Architect – Associate",
      );
      expect(markdown).toContain("AWS Certified Cloud Practitioner");
      expect(markdown).toContain("AWS Knowledge: Amazon EKS");
      expect(markdown).toContain("LFS169: Introduction to GitOps");
    }
    expect(portuguese).toContain("## Certificações");
    expect(portuguese).toContain("## Cursos e badges");
    expect(portuguese).toContain("- Português: Nativo");
    expect(portuguese).toContain("- Inglês: Proficiência profissional");
    expect(english).toContain("## Certifications");
    expect(english).toContain("## Training badges");
    expect(english).toContain("- Portuguese: Native");
    expect(english).toContain("- English: Professional proficiency");
    expect(english).toContain("Network segmentation");
    expect(english).toContain("Incident response");
    expect(english).not.toContain("Segmentação de rede");
  });
});

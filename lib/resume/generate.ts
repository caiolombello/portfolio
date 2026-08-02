import fs from "node:fs";
import path from "node:path";
import { resumeFiles } from "./files";
import { renderResumeMarkdown } from "./markdown";
import type { ResumeModels } from "./model";
import { resumeLocales } from "./model";
import { renderResumePdf } from "./pdf";

export async function generateResumeArtifacts(
  models: ResumeModels,
  outputDirectory: string,
): Promise<void> {
  const artifacts = await Promise.all(
    resumeLocales.map(async (locale) => {
      const model = models[locale];
      const markdown = renderResumeMarkdown(model);
      const pdf = await renderResumePdf(model);

      if (!markdown.trim()) {
        throw new Error(`Generated ${locale} Markdown is empty.`);
      }
      if (pdf.subarray(0, 5).toString("ascii") !== "%PDF-") {
        throw new Error(`Generated ${locale} PDF is invalid.`);
      }

      return { locale, markdown, pdf };
    }),
  );

  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const artifact of artifacts) {
    const files = resumeFiles[artifact.locale];
    fs.writeFileSync(
      path.join(outputDirectory, files.markdown),
      artifact.markdown,
      "utf8",
    );
    fs.writeFileSync(path.join(outputDirectory, files.pdf), artifact.pdf);
  }
}

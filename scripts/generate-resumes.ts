import path from "node:path";
import { generateResumeArtifacts } from "../lib/resume/generate";
import { loadResumeModels } from "../lib/resume/source";

async function main() {
  const rootDirectory = process.cwd();
  const outputDirectory = path.join(rootDirectory, "public");
  const models = loadResumeModels(rootDirectory);

  await generateResumeArtifacts(models, outputDirectory);
  console.log("Generated Portuguese and English PDF/Markdown resumes.");
}

main().catch((error) => {
  console.error("Resume generation failed:", error);
  process.exitCode = 1;
});

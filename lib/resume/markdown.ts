import type { ResumeModel } from "./model";

export function renderResumeMarkdown(model: ResumeModel): string {
  const lines: string[] = [
    `# ${model.personalInfo.name}`,
    "",
    model.personalInfo.title,
    model.personalInfo.location,
    `Email: ${model.personalInfo.email}`,
  ];

  if (model.personalInfo.phone) {
    lines.push(`Phone: ${model.personalInfo.phone}`);
  }
  if (model.personalInfo.linkedin) {
    lines.push(`LinkedIn: ${model.personalInfo.linkedin}`);
  }
  if (model.personalInfo.github) {
    lines.push(`GitHub: ${model.personalInfo.github}`);
  }

  lines.push("", `## ${model.labels.about}`, "", model.summary, "");
  lines.push(`## ${model.labels.experience}`, "");

  for (const experience of model.experiences) {
    lines.push(
      `### ${experience.title} — ${experience.company}`,
      experience.period,
      "",
      ...experience.responsibilities.map((item) => `- ${item}`),
      "",
    );
  }

  lines.push(`## ${model.labels.skills}`, "");
  for (const group of model.skillGroups) {
    lines.push(`- **${group.category}:** ${group.items.join(", ")}`);
  }

  lines.push("", `## ${model.labels.education}`, "");
  for (const item of model.education) {
    lines.push(`### ${item.degree} — ${item.institution}`, item.period);
    if (item.description) lines.push("", item.description);
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

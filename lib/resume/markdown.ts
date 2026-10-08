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

  for (const [label, credentials] of [
    [model.labels.certifications, model.certifications],
    [model.labels.trainingBadges, model.trainingBadges],
  ] as const) {
    if (!credentials.length) continue;
    lines.push(`## ${label}`, "");
    for (const credential of credentials) {
      const name = credential.url
        ? `[${credential.name}](${credential.url})`
        : credential.name;
      const details = [credential.issuer, credential.issuedAt?.slice(0, 4)]
        .filter(Boolean)
        .join(" · ");
      lines.push(`- ${name} — ${details}`);
    }
    lines.push("");
  }

  if (model.languages.length) {
    lines.push(`## ${model.labels.languages}`, "");
    for (const language of model.languages) {
      lines.push(`- ${language.name}: ${language.level}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

import type { ResumeLocale } from "./model";

export const resumeFiles: Record<
  ResumeLocale,
  { pdf: string; markdown: string }
> = {
  pt: { pdf: "curriculo.pdf", markdown: "curriculo.md" },
  en: { pdf: "resume.pdf", markdown: "resume.md" },
};

export function getResumeDownloadFiles(locale: ResumeLocale) {
  const files = resumeFiles[locale];
  return {
    pdf: `/${files.pdf}`,
    markdown: `/${files.markdown}`,
  };
}

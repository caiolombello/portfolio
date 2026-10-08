import { loadProjectById } from "@/lib/data";
import { createOgImage } from "@/lib/og-image";
import { projectTheme } from "@/components/site/project-cover";
import { toProjectView } from "@/lib/site-data";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

export const alt = "Projeto de Caio Barbieri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const locale = await getCurrentRequestLocale();
  const project = await loadProjectById(id);

  if (!project) {
    return createOgImage({
      locale,
      eyebrow: locale === "pt" ? "Projeto" : "Project",
      title: locale === "pt" ? "Projeto não encontrado." : "Project not found.",
      path: getLocalizedInstitutionalPath(`/portfolio/${id}`, locale),
    });
  }

  const view = toProjectView(project, locale);
  const theme = projectTheme(project.id);
  return createOgImage({
    locale,
    eyebrow:
      [view.categoryLabel, view.statusLabel].filter(Boolean).join(" · ") ||
      (locale === "pt" ? "Projeto" : "Project"),
    title: view.title,
    description: view.tagline || view.summary,
    tags: view.technologies,
    theme: { bg: theme.bg, accent: theme.accent },
    path: getLocalizedInstitutionalPath(`/portfolio/${id}`, locale),
  });
}

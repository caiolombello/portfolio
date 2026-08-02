import { loadProjectById } from "@/lib/data";
import { createOgImage } from "@/lib/og-image";
import type { Technology } from "@/types/project";

export const alt = "Projeto de Caio Barbieri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const project = await loadProjectById(id);

  if (!project) {
    return createOgImage({
      eyebrow: "Projeto",
      title: "Projeto não encontrado.",
      path: `/portfolio/${id}`,
    });
  }

  return createOgImage({
    eyebrow: project.category || "Projeto",
    title: project.title_pt || project.title_en,
    description: project.shortDescription_pt || project.shortDescription_en,
    tags: project.technologies?.map((item: Technology) => item.tech),
    path: `/portfolio/${id}`,
  });
}

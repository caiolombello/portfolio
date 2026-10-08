import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";
import { fill, getCopy } from "@/lib/locale/copy";
import { getProjects } from "@/lib/site-data";

export const alt = "Projetos — Caio Barbieri";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const copy = getCopy("pt");
  const projects = await getProjects("pt");
  return createOgImage({
    locale: "pt",
    eyebrow: fill(copy.projects.count, { count: projects.length }),
    title: copy.sections.projects.title,
    description: "Ferramentas para IA, automação em nuvem e o ambiente em que eu trabalho.",
    tags: projects.filter((project) => project.featured).slice(0, 4).map((project) => project.title),
    path: "/portfolio",
  });
}

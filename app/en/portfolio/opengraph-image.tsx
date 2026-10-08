import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";
import { fill, getCopy } from "@/lib/locale/copy";
import { getProjects } from "@/lib/site-data";

export const alt = "Projects — Caio Barbieri";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const copy = getCopy("en");
  const projects = await getProjects("en");
  return createOgImage({
    locale: "en",
    eyebrow: fill(copy.projects.count, { count: projects.length }),
    title: copy.sections.projects.title,
    description: "Tools for AI, cloud automation and the environment I work in.",
    tags: projects.filter((project) => project.featured).slice(0, 4).map((project) => project.title),
    path: "/en/portfolio",
  });
}

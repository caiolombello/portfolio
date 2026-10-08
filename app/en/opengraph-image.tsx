import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";
import { getPerson } from "@/lib/site-data";

export const alt = "Caio Barbieri — Senior SRE · Cloud & Platform Engineering";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const person = await getPerson("en");
  return createOgImage({
    locale: "en",
    eyebrow: "Portfolio · SRE & Cloud",
    title: person.headline[0],
    description: person.headline[1],
    tags: ["AWS", "Kubernetes", "Terraform", "GitOps"],
    path: "/en",
  });
}

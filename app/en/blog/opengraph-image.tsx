import { createOgImage } from "@/lib/og-image";

export const alt = "Caio Barbieri's technical blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Writing",
    title: "Notes from the platform layer.",
    description:
      "Practical decisions about Kubernetes, observability, automation, reliability and delivery.",
    tags: ["Kubernetes", "Observability", "Automation", "SRE"],
    path: "/en/blog",
  });
}

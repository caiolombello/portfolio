import { createOgImage } from "@/lib/og-image";

export const alt = "Caio Barbieri's resume";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Resume",
    title: "Experience in critical platforms, reliability and automation.",
    description:
      "Hands-on work with AWS architecture, Kubernetes, IaC, observability, security and incident response.",
    tags: ["AWS", "Kubernetes", "Terraform", "SRE"],
    path: "/en/resume",
  });
}

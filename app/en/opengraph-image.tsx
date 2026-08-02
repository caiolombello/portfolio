import { createOgImage } from "@/lib/og-image";

export const alt = "Caio Barbieri — DevOps, SRE and Platform Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "SRE · Platform Engineering",
    title: "Infrastructure that helps teams deliver with confidence.",
    description:
      "Observable, resilient and automated cloud platforms — from the first commit to production.",
    tags: ["AWS", "Kubernetes", "Terraform", "GitOps"],
    path: "/en",
  });
}

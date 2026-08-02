import { createOgImage } from "@/lib/og-image";

export const alt = "Caio Barbieri — DevOps, SRE e Platform Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "SRE · Platform Engineering",
    title: "Infraestrutura que ajuda times a entregar com confiança.",
    description:
      "Plataformas cloud observáveis, resilientes e automatizadas — do primeiro commit à produção.",
    tags: ["AWS", "Kubernetes", "Terraform", "GitOps"],
  });
}

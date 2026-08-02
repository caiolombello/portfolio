import { createOgImage } from "@/lib/og-image";

export const alt = "Currículo de Caio Barbieri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Currículo",
    title: "Experiência em plataformas críticas, confiabilidade e automação.",
    description:
      "Atuação hands-on em arquitetura AWS, Kubernetes, IaC, observabilidade, segurança e resposta a incidentes.",
    tags: ["AWS", "Kubernetes", "Terraform", "SRE"],
    path: "/resume",
  });
}

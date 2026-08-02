import { createOgImage } from "@/lib/og-image";

export const alt = "Blog técnico de Caio Barbieri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Escrita",
    title: "Notas da camada de plataforma.",
    description:
      "Decisões práticas sobre Kubernetes, observabilidade, automação, confiabilidade e entrega.",
    tags: ["Kubernetes", "Observabilidade", "Automação", "SRE"],
    path: "/blog",
  });
}

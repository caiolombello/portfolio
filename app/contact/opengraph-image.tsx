import { createOgImage } from "@/lib/og-image";

export const alt = "Entre em contato com Caio Barbieri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Contato",
    title: "Vamos conversar sobre plataformas que precisam durar.",
    description:
      "Oportunidades profissionais, desafios de plataforma e uma segunda visão sobre confiabilidade.",
    tags: ["DevOps", "SRE", "Cloud Native"],
    path: "/contact",
  });
}

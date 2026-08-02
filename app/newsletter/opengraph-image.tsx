import { createOgImage } from "@/lib/og-image";

export const alt = "Radar de Produção — newsletter de DevOps, SRE e Cloud";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Radar de Produção",
    title: "O sinal que importa quando o software encontra produção.",
    description:
      "DevOps, SRE, AWS, Kubernetes, observabilidade e IA — com impacto, evidência e uma ação concreta.",
    tags: ["AWS", "Kubernetes", "SRE", "Observabilidade"],
    path: "/newsletter",
  });
}

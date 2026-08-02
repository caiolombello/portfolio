import { describe, expect, it } from "vitest";

import { createOgImage } from "./og-image";

describe("createOgImage", () => {
  it("renders a large social image without depending on external artwork", async () => {
    const response = createOgImage({
      eyebrow: "ARTIGO · KUBERNETES",
      title:
        "Kubernetes HPA: métricas personalizadas para escalonamento eficaz de CPU e memória",
      description:
        "Um guia prático para operar autoscaling com sinais que representam a carga real da aplicação.",
      tags: ["Kubernetes", "HPA", "Prometheus", "SRE", "Extra"],
      path: "/blog/kubernetes-hpa-custom-metrics.pt",
    });

    expect(response.headers.get("content-type")).toBe("image/png");
    expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(10_000);
  });
});

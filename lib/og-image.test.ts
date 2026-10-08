import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createOgImage } from "./og-image";
import { getPerson } from "./site-data";

describe("createOgImage", () => {
  it("renders a large social image without depending on external artwork", async () => {
    const response = await createOgImage({
      eyebrow: "ARTIGO · KUBERNETES",
      title:
        "Kubernetes HPA: métricas personalizadas para escalonamento eficaz de CPU e memória",
      description:
        "Um guia prático para operar autoscaling com sinais que representam a carga real da aplicação.",
      tags: ["Kubernetes", "HPA", "Prometheus", "SRE", "Extra"],
      path: "/blog/kubernetes-hpa-custom-metrics.pt",
    });

    expect(response.headers.get("content-type")).toBe("image/png");
    const png = Buffer.from(await response.arrayBuffer());
    expect(png.byteLength).toBeGreaterThan(10_000);
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  it("renders English routes with the localized identity and local fonts", async () => {
    const getPersonSpy = vi.spyOn(await import("./site-data"), "getPerson");
    const response = await createOgImage({
      eyebrow: "Writing",
      title: "Notes from the platform layer.",
      description: "Practical decisions about reliability and delivery.",
      tags: ["Kubernetes", "Observability"],
      path: "/en/blog",
    });
    expect(getPersonSpy).toHaveBeenCalledWith("en");
    expect((await getPerson("en")).name).toBe("Caio Barbieri");
    const png = Buffer.from(await response.arrayBuffer());
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    getPersonSpy.mockRestore();
  });
});

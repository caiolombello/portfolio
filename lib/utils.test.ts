import { describe, it, expect } from "vitest";
import { generateSlug } from "./utils";

describe("generateSlug", () => {
  it("converte para minúsculas e substitui espaços por hífens", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("remove acentos e caracteres especiais", () => {
    expect(generateSlug("Olá, mundo!")).toBe("ola-mundo");
    expect(generateSlug("Café com Leite")).toBe("cafe-com-leite");
  });

  it("remove hífens do início e fim", () => {
    expect(generateSlug("  Teste de Slug  ")).toBe("teste-de-slug");
    expect(generateSlug("---Slug---")).toBe("slug");
  });

  it("substitui múltiplos caracteres não alfanuméricos por um único hífen", () => {
    expect(generateSlug("React & Next.js: Portfolio!")).toBe(
      "react-next-js-portfolio",
    );
  });
});

import { describe, expect, it } from "vitest";
import {
  contentLocale,
  formatDuration,
  formatMonthYear,
  localized,
  localizedList,
  monthsBetween,
} from "./format";

describe("monthsBetween", () => {
  it("conta os dois meses das pontas, como no LinkedIn", () => {
    expect(monthsBetween("2022-02-01", "2022-10-01")).toBe(9);
    expect(monthsBetween("2022-10-01", "2024-09-30")).toBe(24);
  });

  it("nunca retorna menos de um mês", () => {
    expect(monthsBetween("2025-06-01", "2025-06-01")).toBe(1);
  });
});

describe("formatDuration", () => {
  it("combina anos e meses no idioma pedido", () => {
    expect(formatDuration(15, "pt")).toBe("1 ano 3 meses");
    expect(formatDuration(24, "pt")).toBe("2 anos");
    expect(formatDuration(1, "pt")).toBe("1 mês");
    expect(formatDuration(15, "en")).toBe("1 yr 3 mos");
  });
});

describe("formatMonthYear", () => {
  it("usa mês abreviado capitalizado, sem ponto, em UTC", () => {
    expect(formatMonthYear("2022-02-01", "pt")).toBe("Fev 2022");
    expect(formatMonthYear("2022-02-01", "en")).toBe("Feb 2022");
  });
});

describe("conteúdo localizado", () => {
  const project = {
    title_pt: "Este portfólio",
    title_en: "This portfolio",
    tagline_pt: "Só em português",
    highlights_pt: ["a", "b"],
    highlights_en: ["x"],
  };

  it("espanhol lê a versão em inglês", () => {
    expect(contentLocale("es")).toBe("en");
    expect(localized(project, "title", "es")).toBe("This portfolio");
  });

  it("cai para o outro idioma quando o campo não existe", () => {
    expect(localized(project, "tagline", "en")).toBe("Só em português");
    expect(localized(project, "missing", "pt")).toBe("");
  });

  it("lê listas e o formato { item } usado nas experiências", () => {
    expect(localizedList(project, "highlights", "pt")).toEqual(["a", "b"]);
    expect(
      localizedList(
        { responsibilities_pt: [{ item: "um" }] },
        "responsibilities",
        "en",
      ),
    ).toEqual(["um"]);
  });
});

import "server-only";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  pt: () => import("@/dictionaries/pt.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
};

export type Lang = keyof typeof dictionaries;

export async function getDictionary(locale: Lang) {
  return dictionaries[locale]();
}

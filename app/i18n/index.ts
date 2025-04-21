import { en } from "./dictionaries/en";
import { pt } from "./dictionaries/pt";
import { es } from "./dictionaries/es";

export const dictionaries = {
  en,
  pt,
  es,
};

export const getDictionary = async (locale: string) => {
  try {
    return dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error);
    return dictionaries.en;
  }
};

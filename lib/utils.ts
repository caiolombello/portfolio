import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-") // Substitui caracteres não alfanuméricos por hífen
    .replace(/(^-|-$)+/g, ""); // Remove hífens do início e fim
}

export function formatDate(date: string, lang: string): string {
  return new Date(date).toLocaleDateString(
    lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

import type { SiteLocale } from "./request-locale";

const LOCALES: Record<SiteLocale, string> = {
  en: "en-US",
  pt: "pt-BR",
};

export function parseBlogDate(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`Invalid blog date: ${value}`);
  }

  return date;
}

export function formatBlogDate(value: string, language: SiteLocale): string {
  return new Intl.DateTimeFormat(LOCALES[language], {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(parseBlogDate(value));
}

export function formatBlogDateShort(value: string, language: SiteLocale): string {
  return new Intl.DateTimeFormat(LOCALES[language], {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(parseBlogDate(value));
}

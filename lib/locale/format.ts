import type { Locale } from "@/app/i18n/settings";
import { getCopy } from "./copy";

/** Content is written in pt and en; Spanish visitors read the English version. */
export function contentLocale(locale: Locale): "pt" | "en" {
  return locale === "pt" ? "pt" : "en";
}

/** Reads `field_pt` / `field_en` from a content record, falling back to the other language. */
export function localized(item: object, field: string, locale: Locale): string {
  const record = item as Record<string, unknown>;
  const candidates = [
    record[`${field}_${contentLocale(locale)}`],
    record[`${field}_en`],
    record[`${field}_pt`],
    record[field],
  ];
  const value = candidates.find(
    (candidate) => typeof candidate === "string" && candidate.trim(),
  );
  return typeof value === "string" ? value : "";
}

export function localizedList(
  item: object,
  field: string,
  locale: Locale,
): string[] {
  const record = item as Record<string, unknown>;
  const candidates = [
    record[`${field}_${contentLocale(locale)}`],
    record[`${field}_en`],
    record[`${field}_pt`],
  ];
  const value = candidates.find(
    (candidate) => Array.isArray(candidate) && candidate.length > 0,
  );
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) =>
      typeof entry === "string" ? entry : (entry as { item?: string })?.item,
    )
    .filter((entry): entry is string => Boolean(entry));
}

function toDate(value: string | Date): Date {
  return typeof value === "string" ? new Date(value) : value;
}

/** "Fev 2022" / "Feb 2022" */
export function formatMonthYear(value: string | Date, locale: Locale): string {
  const parts = new Intl.DateTimeFormat(getCopy(locale).locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(toDate(value));
  const month = (
    parts.find((part) => part.type === "month")?.value ?? ""
  ).replace(".", "");
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`.trim();
}

/** "17 de março de 2023" / "March 17, 2023" */
export function formatLongDate(value: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(getCopy(locale).locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(toDate(value));
}

/** "17 mar 2023" */
export function formatShortDate(value: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(getCopy(locale).locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(toDate(value))
    .replace(/\./g, "")
    .replace(/ de /g, " ");
}

/** Whole months between two dates, counting both ends (LinkedIn-style). */
export function monthsBetween(start: string, end?: string): number {
  const from = new Date(start);
  const to = end ? new Date(end) : new Date();
  const months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth()) +
    1;
  return Math.max(1, months);
}

/** "1 ano 3 meses" / "1 yr 3 mos" */
export function formatDuration(months: number, locale: Locale): string {
  const labels = getCopy(locale).duration;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? labels.year : labels.years}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? labels.month : labels.months}`);
  return parts.join(" ");
}

export function readingTimeMinutes(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

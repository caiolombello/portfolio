export type ResumePeriodLocale = "pt" | "en";

const monthLabels: Record<ResumePeriodLocale, string[]> = {
  pt: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

function formatDate(value: string, locale: ResumePeriodLocale): string | null {
  const match = /^(\d{4})(?:-(\d{2}))?/.exec(value);
  if (!match) return null;

  const [, year, monthValue] = match;
  if (!monthValue) return year;

  const month = Number(monthValue);
  if (month < 1 || month > 12) return null;

  return `${monthLabels[locale][month - 1]} ${year}`;
}

export function formatResumePeriod(
  startDate: string | undefined,
  endDate: string | undefined,
  fallback: string,
  locale: ResumePeriodLocale,
): string {
  if (!startDate) return fallback;

  const start = formatDate(startDate, locale);
  if (!start) return fallback;

  const end = endDate
    ? formatDate(endDate, locale)
    : locale === "pt"
      ? "atual"
      : "Present";

  return end ? `${start} – ${end}` : fallback;
}

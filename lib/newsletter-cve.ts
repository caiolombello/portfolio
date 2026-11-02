import { z } from "zod";

// Mirrors radar-de-producao src/radar/cve_section.py (payload and email rules).
const CVE_ID_PATTERN = /^CVE-\d{4}-\d{4,7}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAXIMUM_ITEMS = 8;

export const CVE_SECTION_TITLE = "CVEs da semana";
export const CVE_EMPTY_MESSAGE =
  "Nenhuma CVE crítica relevante para cloud, Linux ou Kubernetes nesta semana.";
export const CVE_UNAVAILABLE_MESSAGE =
  "A fonte de CVEs (cve.now) ficou indisponível nesta semana; a seção volta na próxima edição.";

const MONTHS = [
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
];

const isoDate = z
  .string()
  .regex(ISO_DATE_PATTERN)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  });

const cveItemSchema = z
  .object({
    cve_id: z.string().regex(CVE_ID_PATTERN),
    url: z.string(),
    title: z.string().trim().min(1).max(200),
    product: z.string().max(100).default(""),
    cvss: z.number().min(0).max(10).nullable().default(null),
    severity: z.string().max(20).default(""),
    kev: z.boolean().default(false),
    actively_exploited: z.boolean().default(false),
    public_exploit: z.boolean().default(false),
    poc: z.boolean().default(false),
    date: isoDate,
    event: z.string().trim().min(1).max(60),
    summary: z.string().max(400).default(""),
  })
  .refine((item) => item.url === `https://cve.now/${item.cve_id}`);

const cveSectionSchema = z
  .object({
    status: z.enum(["ok", "empty", "unavailable"]),
    window_start: isoDate.nullable().optional(),
    window_end: isoDate.nullable().optional(),
    items: z.array(cveItemSchema).max(MAXIMUM_ITEMS),
  })
  .refine((section) => (section.status === "ok") === section.items.length > 0);

export type CveSectionItem = z.infer<typeof cveItemSchema>;

export interface CveSection {
  status: "ok" | "empty" | "unavailable";
  windowEnd: string | null;
  items: CveSectionItem[];
}

/**
 * Normalizes `issue.cve_section`. A missing field means the issue predates
 * the section (render nothing); a malformed one renders as "unavailable",
 * the same fallback the email uses.
 */
export function parseCveSection(value: unknown): CveSection | null {
  if (value === undefined) return null;
  const result = cveSectionSchema.safeParse(value);
  if (!result.success) {
    return { status: "unavailable", windowEnd: null, items: [] };
  }
  return {
    status: result.data.status,
    windowEnd: result.data.window_end ?? null,
    items: result.data.items,
  };
}

export function cveUrl(cveId: string): string {
  return `https://cve.now/${encodeURIComponent(cveId)}`;
}

export function cveBadges(item: CveSectionItem): string[] {
  const badges: string[] = [];
  if (item.kev) badges.push("KEV");
  else if (item.actively_exploited) badges.push("Exploração ativa");
  if (item.public_exploit) badges.push("Exploit público");
  else if (item.poc) badges.push("PoC");
  return badges;
}

export function cveScoreLabel(item: CveSectionItem): string | null {
  if (item.cvss !== null) {
    const severity = item.severity ? ` (${item.severity})` : "";
    return `CVSS ${item.cvss.toFixed(1)}${severity}`;
  }
  return item.severity ? `Severidade ${item.severity.toLowerCase()}` : null;
}

export function cveShortDate(
  value: string,
  referenceDate: string | null,
): string {
  const [year, month, day] = value.split("-").map(Number);
  const label = `${day} ${MONTHS[month - 1]}`;
  const referenceYear = referenceDate
    ? Number(referenceDate.slice(0, 4))
    : null;
  return referenceYear === year ? label : `${label} ${year}`;
}

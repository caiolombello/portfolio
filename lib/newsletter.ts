import { z } from "zod";

const DEFAULT_NEWSLETTER_API_URL =
  "https://ryvtguwxbf.execute-api.us-east-1.amazonaws.com";
const ISSUE_ID_PATTERN = /^\d{4}-W\d{2}$/;

const httpsUrl = z
  .string()
  .url()
  .refine((value) => new URL(value).protocol === "https:", {
    message: "Source URLs must use HTTPS",
  });

const issueSummarySchema = z.object({
  issue_id: z.string().regex(ISSUE_ID_PATTERN),
  title: z.string().min(1).max(300),
  preheader: z.string().max(500),
});

const claimSchema = z.object({
  text: z.string().min(1).max(1_000),
  evidence_excerpt: z.string().min(1).max(2_000),
  source_id: z.string().min(1).max(128),
  status: z.enum(["supported", "unsupported"]),
});

const issueItemSchema = z.object({
  item_id: z.string().min(1).max(128),
  headline: z.string().min(1).max(500),
  summary: z.string().min(1).max(4_000),
  why_it_matters: z.string().min(1).max(4_000),
  recommended_action: z.string().min(1).max(4_000),
  canonical_url: httpsUrl,
  category: z.enum([
    "aws_cloud",
    "kubernetes_cloud_native",
    "observability_sre",
    "ai_operations",
    "security_deprecations",
  ]),
  published_at: z.string().datetime({ offset: true }),
  claims: z.array(claimSchema).max(4),
});

const newsletterIssueSchema = z.object({
  issue_id: z.string().regex(ISSUE_ID_PATTERN),
  title: z.string().min(1).max(300),
  preheader: z.string().min(1).max(500),
  introduction: z.string().min(1).max(5_000),
  quick_summary: z.array(z.string().min(1).max(1_000)).length(3),
  action_of_the_week: z.string().min(1).max(4_000),
  items: z.array(issueItemSchema).min(1).max(8),
});

const archiveSchema = z.object({
  issues: z.array(issueSummarySchema).max(20),
});

export type NewsletterIssueSummary = z.infer<typeof issueSummarySchema>;
export type NewsletterIssue = z.infer<typeof newsletterIssueSchema>;

export function getNewsletterApiUrl(): string {
  const configuredUrl =
    process.env.RADAR_API_URL ??
    process.env.NEXT_PUBLIC_RADAR_API_URL ??
    DEFAULT_NEWSLETTER_API_URL;
  const parsed = new URL(configuredUrl);
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error("RADAR API URL must be a credential-free HTTPS URL");
  }
  return parsed.toString().replace(/\/$/, "");
}

export function buildNewsletterApiEndpoint(
  baseUrl: string,
  path: string,
): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Newsletter API path must be absolute");
  }
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

export function parseNewsletterArchive(
  value: unknown,
): NewsletterIssueSummary[] {
  return archiveSchema.parse(value).issues;
}

export function parseNewsletterIssue(value: unknown): NewsletterIssue {
  return newsletterIssueSchema.parse(value);
}

export async function loadNewsletterArchive(): Promise<
  NewsletterIssueSummary[]
> {
  const response = await fetch(
    buildNewsletterApiEndpoint(getNewsletterApiUrl(), "/issues"),
    {
      headers: { accept: "application/json" },
      next: { revalidate: 300 },
    },
  );
  if (!response.ok) throw new Error("Newsletter archive is unavailable");
  return parseNewsletterArchive(await response.json());
}

export async function loadNewsletterIssue(
  issueId: string,
): Promise<NewsletterIssue | null> {
  if (!ISSUE_ID_PATTERN.test(issueId)) return null;
  const response = await fetch(
    buildNewsletterApiEndpoint(
      getNewsletterApiUrl(),
      `/issues/${encodeURIComponent(issueId)}`,
    ),
    {
      headers: { accept: "application/json" },
      next: { revalidate: 300 },
    },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Newsletter issue is unavailable");
  return parseNewsletterIssue(await response.json());
}

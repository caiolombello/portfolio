/**
 * LinkedIn Experience Sync Script
 *
 * Syncs experience data from LinkedIn using the Voyager API (internal API).
 * This script runs LOCALLY only and saves static JSON files.
 * Visitors to the site never consume any API.
 *
 * Usage:
 *   npx tsx scripts/sync-linkedin.ts          # reads from .env
 *   npm run sync-linkedin                     # same, via npm script
 *
 * Required env vars (in .env or environment):
 *   LINKEDIN_COOKIE   - value of the li_at cookie from linkedin.com
 *   LINKEDIN_USERNAME - your LinkedIn profile username
 *
 * The li_at cookie can be obtained from your browser after logging into LinkedIn:
 *   1. Open LinkedIn in your browser
 *   2. Open DevTools (F12) > Application > Cookies > linkedin.com
 *   3. Copy the value of the "li_at" cookie
 *
 * Note: The li_at cookie expires periodically. When it does, the script
 * will skip gracefully and your existing experience files are preserved.
 */

import * as fs from "fs";
import * as path from "path";

// Load .env file if it exists (no external deps needed)
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const LINKEDIN_COOKIE = process.env.LINKEDIN_COOKIE;
const LINKEDIN_USERNAME = process.env.LINKEDIN_USERNAME;

if (!LINKEDIN_COOKIE || !LINKEDIN_USERNAME) {
  console.log(
    "Skipping LinkedIn sync: LINKEDIN_COOKIE and/or LINKEDIN_USERNAME not set.",
  );
  process.exit(0);
}

// --- Types ---

interface DateRange {
  start?: { month?: number; year?: number };
  end?: { month?: number; year?: number };
}

interface VectorImage {
  rootUrl?: string;
  artifacts?: Array<{
    width?: number;
    height?: number;
    fileIdentifyingUrlPathSegment?: string;
  }>;
}

interface CompanyInfo {
  name?: string;
  universalName?: string;
  url?: string;
  logo?: { vectorImage?: VectorImage };
}

interface ParsedPosition {
  companyName: string;
  title: string;
  dateRange?: DateRange;
  company?: CompanyInfo;
  companyUrn?: string;
}

interface ParsedEducation {
  schoolName: string;
  degreeName?: string;
  fieldOfStudy?: string;
  dateRange?: DateRange;
  school?: CompanyInfo;
}

interface EducationJson {
  institution: string;
  logo?: string;
  institutionUrl?: string;
  degree_pt: string;
  degree_en: string;
  period: string;
  description_pt?: string;
  description_en?: string;
  endDate?: string;
}

interface ExperienceJson {
  company: string;
  logo?: string;
  companyUrl?: string;
  title_pt: string;
  title_en: string;
  period: string;
  responsibilities_pt: Array<{ item: string }>;
  responsibilities_en: Array<{ item: string }>;
  startDate?: string;
  endDate?: string;
}

// --- Helpers ---

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(date?: { month?: number; year?: number }): string {
  if (!date?.year) return "";
  const month = date.month ? MONTHS[date.month - 1] : "";
  return `${month} ${date.year}`.trim();
}

function formatPeriod(dateRange?: DateRange): string {
  const start = formatDate(dateRange?.start);
  const end = dateRange?.end ? formatDate(dateRange.end) : "Present";
  return `${start} - ${end}`;
}

function toISODate(date?: { month?: number; year?: number }): string | undefined {
  if (!date?.year) return undefined;
  const month = date.month ? String(date.month).padStart(2, "0") : "01";
  return `${date.year}-${month}-01`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractLogoUrl(company?: CompanyInfo): string | undefined {
  const vi = company?.logo?.vectorImage;
  if (!vi?.rootUrl || !vi?.artifacts?.length) return undefined;
  // Pick the 200px artifact for a good balance of quality/size, fallback to first
  const preferred = vi.artifacts.find((a) => a.width === 200) || vi.artifacts[0];
  if (preferred?.fileIdentifyingUrlPathSegment) {
    return `${vi.rootUrl}${preferred.fileIdentifyingUrlPathSegment}`;
  }
  return undefined;
}

function extractCompanyUrl(company?: CompanyInfo): string | undefined {
  if (company?.url) return company.url;
  if (company?.universalName) {
    return `https://www.linkedin.com/company/${company.universalName}/`;
  }
  return undefined;
}

// --- LinkedIn API ---

async function getSessionId(): Promise<string> {
  // Try multiple LinkedIn URLs to obtain JSESSIONID
  const urls = [
    "https://www.linkedin.com/voyager/api/me",
    "https://www.linkedin.com/feed/",
    "https://www.linkedin.com/",
  ];

  for (const url of urls) {
    const resp = await fetch(url, {
      headers: {
        cookie: `li_at=${LINKEDIN_COOKIE}`,
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "manual",
    });

    const cookies = resp.headers.getSetCookie?.() || [];
    for (const cookie of cookies) {
      const m = cookie.match(/JSESSIONID="?([^";]+)"?/);
      if (m) return m[1];
    }

    const raw = resp.headers.get("set-cookie") || "";
    const m = raw.match(/JSESSIONID="?([^";]+)"?/);
    if (m) return m[1];
  }

  throw new Error(
    "Could not obtain JSESSIONID from LinkedIn. Your li_at cookie may be expired.\n" +
    "To refresh: open LinkedIn in your browser, copy the new li_at cookie value, and update .env",
  );
}

async function voyagerFetch(url: string, jsessionId: string): Promise<Response> {
  return fetch(url, {
    headers: {
      cookie: `li_at=${LINKEDIN_COOKIE}; JSESSIONID="${jsessionId}"`,
      "csrf-token": jsessionId,
      "x-li-lang": "en_US",
      "x-restli-protocol-version": "2.0.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
}

interface ProfileData {
  positions: ParsedPosition[];
  educations: ParsedEducation[];
}

async function fetchProfile(): Promise<ProfileData> {
  console.log(`Fetching LinkedIn profile: ${LINKEDIN_USERNAME}`);

  const jsessionId = await getSessionId();

  const url =
    `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${LINKEDIN_USERNAME}` +
    `&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-93`;

  const response = await voyagerFetch(url, jsessionId);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}\n${text.slice(0, 500)}`);
  }

  const data = await response.json();
  const profile = data?.elements?.[0];

  // --- Parse positions ---
  const positions: ParsedPosition[] = [];
  const groups = profile?.profilePositionGroups?.elements;

  if (Array.isArray(groups)) {
    for (const group of groups) {
      const groupCompanyName: string = group.companyName || "Unknown Company";
      const groupCompany: CompanyInfo | undefined = group.company;
      const positionsInGroup = group?.profilePositionInPositionGroup?.elements;

      if (!Array.isArray(positionsInGroup)) continue;

      for (const pos of positionsInGroup) {
        positions.push({
          companyName: pos.companyName || groupCompanyName,
          title: pos.title || "Unknown Title",
          dateRange: pos.dateRange,
          company: pos.company || groupCompany,
          companyUrn: pos.companyUrn,
        });
      }
    }
  }

  console.log(`Found ${positions.length} position(s)`);

  // --- Parse educations ---
  const educations: ParsedEducation[] = [];
  const eduElements = profile?.profileEducations?.elements;

  if (Array.isArray(eduElements)) {
    for (const edu of eduElements) {
      educations.push({
        schoolName: edu.schoolName || "Unknown Institution",
        degreeName: edu.degreeName,
        fieldOfStudy: edu.fieldOfStudy,
        dateRange: edu.dateRange,
        school: edu.school,
      });
    }
  }

  console.log(`Found ${educations.length} education(s)`);

  return { positions, educations };
}

// --- File matching ---

/**
 * Find an existing JSON file in `dir` that matches a given entity by reading
 * its content and comparing title_en/title (for experiences) or degree_en (for educations).
 * Falls back to matching by slug prefix in the filename.
 */
function findExistingFile(
  dir: string,
  slug: string,
  matchFn: (data: Record<string, unknown>) => boolean,
): string | null {
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  // First pass: match by content (most accurate)
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
      if (matchFn(data)) return file;
    } catch { /* skip invalid */ }
  }

  return null;
}

function findExperienceFile(dir: string, pos: ParsedPosition): string | null {
  const isoStart = toISODate(pos.dateRange?.start);
  return findExistingFile(dir, slugify(pos.companyName), (data) => {
    // Match by title_en + startDate (most precise)
    if (data.title_en === pos.title && data.startDate === isoStart) return true;
    // Match by title_en + period overlap
    if (data.title_en === pos.title && data.company === pos.companyName) return true;
    return false;
  });
}

function findEducationFile(dir: string, edu: ParsedEducation): string | null {
  const slug = slugify(edu.schoolName);
  return findExistingFile(dir, slug, (data) => {
    // Match by institution name (fuzzy: slug comparison)
    const instSlug = slugify(String(data.institution || ""));
    return instSlug === slug || instSlug.startsWith(slug) || slug.startsWith(instSlug);
  });
}

function newFilename(name: string, start?: { month?: number; year?: number }): string {
  const slug = slugify(name);
  const year = start?.year || new Date().getFullYear();
  if (start?.month) {
    const month = String(start.month).padStart(2, "0");
    return `${slug}-${year}-${month}.json`;
  }
  return `${slug}-${year}.json`;
}

// --- Sync logic ---

async function syncExperiences(positions: ParsedPosition[]) {
  const dir = path.join(process.cwd(), "content", "experience");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (positions.length === 0) {
    console.log("No positions found.");
    return;
  }

  let created = 0;
  let updated = 0;
  const matchedFiles = new Set<string>();

  for (const pos of positions) {
    const logo = extractLogoUrl(pos.company);
    const companyUrl = extractCompanyUrl(pos.company);

    // Try to find existing file that matches this position
    const existingFile = findExperienceFile(dir, pos);

    if (existingFile && !matchedFiles.has(existingFile)) {
      matchedFiles.add(existingFile);
      const filepath = path.join(dir, existingFile);
      const existing: ExperienceJson = JSON.parse(fs.readFileSync(filepath, "utf-8"));

      // Update metadata from LinkedIn, preserve manual content (responsibilities, title_pt)
      existing.logo = logo || existing.logo;
      existing.companyUrl = companyUrl || existing.companyUrl;
      existing.title_en = pos.title;
      existing.period = formatPeriod(pos.dateRange);
      const isoStart = toISODate(pos.dateRange?.start);
      const isoEnd = toISODate(pos.dateRange?.end);
      if (isoStart) existing.startDate = isoStart;
      if (isoEnd) existing.endDate = isoEnd;

      fs.writeFileSync(filepath, JSON.stringify(existing, null, 2) + "\n");
      console.log(`  Updated: ${existingFile}`);
      updated++;
    } else if (!existingFile) {
      const filename = newFilename(pos.companyName, pos.dateRange?.start);
      const filepath = path.join(dir, filename);

      // Double-check we're not creating over an unmatched file
      if (fs.existsSync(filepath)) {
        console.log(`  Skipped: ${filename} (file exists, no content match)`);
        continue;
      }

      const newExp: ExperienceJson = {
        company: pos.companyName,
        logo,
        companyUrl,
        title_pt: pos.title,
        title_en: pos.title,
        period: formatPeriod(pos.dateRange),
        responsibilities_pt: [{ item: "TODO: Add responsibilities in Portuguese" }],
        responsibilities_en: [{ item: "TODO: Add responsibilities in English" }],
        startDate: toISODate(pos.dateRange?.start),
        endDate: toISODate(pos.dateRange?.end),
      };

      fs.writeFileSync(filepath, JSON.stringify(newExp, null, 2) + "\n");
      console.log(`  Created: ${filename} (fill in responsibilities manually)`);
      created++;
    }
  }

  console.log(`  Experiences — Created: ${created}, Updated: ${updated}`);
}

async function syncEducations(educations: ParsedEducation[]) {
  const dir = path.join(process.cwd(), "content", "education");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (educations.length === 0) {
    console.log("No educations found.");
    return;
  }

  let created = 0;
  let updated = 0;

  for (const edu of educations) {
    const logo = extractLogoUrl(edu.school);
    const institutionUrl = extractCompanyUrl(edu.school);

    const existingFile = findEducationFile(dir, edu);

    if (existingFile) {
      const filepath = path.join(dir, existingFile);
      const existing: EducationJson = JSON.parse(fs.readFileSync(filepath, "utf-8"));

      const degree = [edu.degreeName, edu.fieldOfStudy].filter(Boolean).join(", ");

      existing.logo = logo || existing.logo;
      existing.institutionUrl = institutionUrl || existing.institutionUrl;
      existing.period = formatPeriod(edu.dateRange);
      if (degree) existing.degree_en = degree;
      const isoEnd = toISODate(edu.dateRange?.end);
      if (isoEnd) existing.endDate = isoEnd;

      fs.writeFileSync(filepath, JSON.stringify(existing, null, 2) + "\n");
      console.log(`  Updated: ${existingFile}`);
      updated++;
    } else {
      const degree = [edu.degreeName, edu.fieldOfStudy].filter(Boolean).join(", ") || "Unknown Degree";
      const filename = newFilename(edu.schoolName, edu.dateRange?.start);
      const filepath = path.join(dir, filename);

      if (fs.existsSync(filepath)) {
        console.log(`  Skipped: ${filename} (file exists, no content match)`);
        continue;
      }

      const newEdu: EducationJson = {
        institution: edu.schoolName,
        logo,
        institutionUrl,
        degree_pt: degree,
        degree_en: degree,
        period: formatPeriod(edu.dateRange),
        endDate: toISODate(edu.dateRange?.end),
      };

      fs.writeFileSync(filepath, JSON.stringify(newEdu, null, 2) + "\n");
      console.log(`  Created: ${filename} (fill in details manually)`);
      created++;
    }
  }

  console.log(`  Educations — Created: ${created}, Updated: ${updated}`);
}

async function main() {
  const { positions, educations } = await fetchProfile();

  console.log("\nSyncing experiences...");
  await syncExperiences(positions);

  console.log("\nSyncing educations...");
  await syncEducations(educations);

  console.log("\nDone!");
}

main().catch((err) => {
  console.warn("LinkedIn sync failed (non-fatal):", err.message || err);
  console.warn("Existing experience files are preserved. Build continues.");
  process.exit(0);
});

import type { Metadata } from "next";

import NewsletterLanding from "@/components/newsletter/newsletter-landing";
import { getSiteConfig } from "@/lib/config-server";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import {
  getNewsletterSeoCopy,
  buildNewsletterCollectionJsonLd,
} from "@/lib/newsletter-seo";
import { generateJsonLd, generatePageMetadata } from "@/lib/site-metadata";
import {
  getNewsletterApiUrl,
  loadNewsletterArchive,
  loadNewsletterStatus,
  type NewsletterIssueSummary,
} from "@/lib/newsletter";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentRequestLocale();
  const copy = getNewsletterSeoCopy(locale);

  return generatePageMetadata({
    path: "/newsletter",
    locale,
    title: copy.title,
    description: copy.description,
  });
}

export default async function NewsletterPage() {
  const locale = await getCurrentRequestLocale();
  const [archiveResult, statusResult] = await Promise.allSettled([
    loadNewsletterArchive(),
    loadNewsletterStatus(),
  ]);
  const issues: NewsletterIssueSummary[] =
    archiveResult.status === "fulfilled" ? archiveResult.value : [];
  const archiveAvailable = archiveResult.status === "fulfilled";
  const signupEnabled =
    statusResult.status === "fulfilled" && statusResult.value.signup_enabled;
  const structuredData = buildNewsletterCollectionJsonLd({
    baseUrl: getSiteConfig().site.url,
    locale,
    issues,
  });

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateJsonLd(structuredData)}
        />
      )}
      <NewsletterLanding
        locale={locale === "en" ? "en" : "pt"}
        apiUrl={getNewsletterApiUrl()}
        issues={issues}
        archiveAvailable={archiveAvailable}
        signupEnabled={signupEnabled}
      />
    </>
  );
}

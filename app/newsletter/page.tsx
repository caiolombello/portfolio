import type { Metadata } from "next";

import NewsletterLanding from "@/components/newsletter/newsletter-landing";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import { generatePageMetadata } from "@/lib/site-metadata";
import {
  getNewsletterApiUrl,
  loadNewsletterArchive,
  loadNewsletterStatus,
  type NewsletterIssueSummary,
} from "@/lib/newsletter";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: "/newsletter",
    locale,
    title: "Radar de Produção",
    description:
      locale === "pt"
        ? "Newsletter semanal sobre DevOps, SRE, AWS, Kubernetes, observabilidade e IA, explicada pelo impacto real em produção."
        : "A weekly newsletter about DevOps, SRE, AWS, Kubernetes, observability, and AI, explained through real production impact.",
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

  return (
    <NewsletterLanding
      locale={locale === "en" ? "en" : "pt"}
      apiUrl={getNewsletterApiUrl()}
      issues={issues}
      archiveAvailable={archiveAvailable}
      signupEnabled={signupEnabled}
    />
  );
}

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getCopy } from "@/lib/locale/copy";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";

export default async function NotFound() {
  const locale = await getCurrentRequestLocale();
  const copy = getCopy(locale);
  const portfolioEnabled = isPortfolioEnabled(getSiteConfig());

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid mask-radial-top pointer-events-none absolute inset-0 -z-10"
      />
      <div className="container flex min-h-[70vh] flex-col items-start justify-center py-20">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-brand">$</span> curl -I {"<this-page>"}
        </p>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          HTTP/2 404
        </p>
        <h1 className="mt-8 text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
          {copy.notFound.title}
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {copy.notFound.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={getLocalizedInstitutionalPath("/", locale)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-105"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {copy.notFound.home}
          </Link>
          {portfolioEnabled && (
            <Link
              href={getLocalizedInstitutionalPath("/portfolio", locale)}
              className="inline-flex h-11 items-center gap-2 rounded-full border bg-card/70 px-5 text-sm font-semibold transition-colors hover:border-foreground/25"
            >
              {copy.notFound.projects}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

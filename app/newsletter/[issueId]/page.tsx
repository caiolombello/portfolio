import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Radar,
} from "lucide-react";

import { getSiteConfig } from "@/lib/config-server";
import { loadNewsletterIssue, type NewsletterIssue } from "@/lib/newsletter";

interface IssuePageProps {
  params: Promise<{ issueId: string }>;
}

const categoryLabels: Record<
  NewsletterIssue["items"][number]["category"],
  string
> = {
  aws_cloud: "AWS & Cloud",
  kubernetes_cloud_native: "Kubernetes & Cloud Native",
  observability_sre: "Observabilidade & SRE",
  ai_operations: "IA para operações",
  security_deprecations: "Segurança & depreciações",
};

export async function generateMetadata({
  params,
}: IssuePageProps): Promise<Metadata> {
  const { issueId } = await params;
  const issue = await loadNewsletterIssue(issueId);
  if (!issue) return { title: "Edição não encontrada" };

  const config = getSiteConfig();
  const url = new URL(
    `/newsletter/${encodeURIComponent(issue.issue_id)}`,
    `${config.site.url}/`,
  ).toString();

  return {
    title: issue.title,
    description: issue.preheader,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: issue.title,
      description: issue.preheader,
      url,
      locale: "pt_BR",
      siteName: config.site.shortName,
    },
    twitter: {
      card: "summary_large_image",
      title: issue.title,
      description: issue.preheader,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
    },
  };
}

export default async function NewsletterIssuePage({ params }: IssuePageProps) {
  const { issueId } = await params;
  const issue = await loadNewsletterIssue(issueId);
  if (!issue) notFound();

  return (
    <main>
      <header className="border-b border-border/70 py-12 sm:py-16 lg:py-20">
        <div className="container max-w-4xl">
          <Link
            href="/newsletter#arquivo"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao arquivo
          </Link>
          <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Radar de Produção · {issue.issue_id}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            {issue.title}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {issue.introduction}
          </p>
          <p className="mt-7 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
            Leitura de aproximadamente 5 minutos
          </p>
        </div>
      </header>

      <div className="container max-w-4xl py-12 sm:py-16">
        <section
          aria-labelledby="quick-summary-title"
          className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <Radar className="h-5 w-5 text-gold" aria-hidden="true" />
            <h2 id="quick-summary-title" className="text-xl font-semibold">
              Em 30 segundos
            </h2>
          </div>
          <ul className="mt-5 space-y-4">
            {issue.quick_summary.map((summary) => (
              <li key={summary} className="flex gap-3 text-sm leading-6">
                <CheckCircle2
                  className="mt-1 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span>{summary}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
          {issue.items.map((item, index) => (
            <article
              key={item.item_id}
              className="border-b border-border/70 pb-12 last:border-0 sm:pb-16"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">
                  {categoryLabels[item.category]}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                {item.headline}
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                {item.summary}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-border/80 bg-card/45 p-5">
                  <h3 className="text-sm font-semibold text-foreground">
                    Por que importa em produção
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.why_it_matters}
                  </p>
                </section>
                <section className="rounded-xl border border-border/80 bg-card/45 p-5">
                  <h3 className="text-sm font-semibold text-foreground">
                    O que verificar
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.recommended_action}
                  </p>
                </section>
              </div>

              <a
                href={item.canonical_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold/80"
              >
                Consultar fonte oficial
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        <section className="mt-4 rounded-2xl border border-gold/25 bg-card/60 p-6 sm:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Ação da semana
          </p>
          <p className="mt-4 text-lg font-medium leading-8">
            {issue.action_of_the_week}
          </p>
        </section>
      </div>
    </main>
  );
}

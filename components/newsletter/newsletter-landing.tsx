import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Boxes,
  CalendarDays,
  Cloud,
  Eye,
  Radar,
  ShieldCheck,
} from "lucide-react";

import NewsletterSignupForm from "./signup-form";
import type { NewsletterIssueSummary } from "@/lib/newsletter";

const content = {
  pt: {
    eyebrow: "Newsletter semanal · operação real",
    title: "As mudanças que importam quando o software encontra produção.",
    description:
      "DevOps, SRE, AWS, Kubernetes, observabilidade e IA — filtrados pelo impacto operacional, sustentados por fontes primárias e fechados com uma ação concreta.",
    cadence: "Sexta-feira · leitura de 5 minutos",
    signupEyebrow: "Radar de Produção",
    signupTitle: "Receba o sinal, não o ruído.",
    signupDescription:
      "Uma edição curta para decidir o que revisar, testar ou acompanhar na próxima semana.",
    methodEyebrow: "Como funciona",
    methodTitle: "Automação com critérios editoriais explícitos.",
    methods: [
      {
        title: "Fontes primárias",
        description:
          "Release notes, blogs oficiais e advisories. Descoberta social nunca vira evidência.",
      },
      {
        title: "Impacto em produção",
        description:
          "Cada item explica o que mudou, por que importa e o que vale verificar.",
      },
      {
        title: "Falha segura",
        description:
          "Sem evidência, links válidos ou volume suficiente, a edição não é publicada.",
      },
    ],
    archiveEyebrow: "Arquivo",
    archiveTitle: "Edições publicadas",
    archiveDescription:
      "Cada edição fica disponível aqui para consulta e compartilhamento.",
    empty: "A primeira edição publicada aparecerá aqui.",
    unavailable:
      "O arquivo está temporariamente indisponível. A inscrição continua visível, mas pode permanecer desativada durante a preparação inicial.",
    read: "Ler edição",
  },
  en: {
    eyebrow: "Weekly newsletter · real operations",
    title: "The changes that matter when software meets production.",
    description:
      "DevOps, SRE, AWS, Kubernetes, observability, and AI — filtered by operational impact, grounded in primary sources, and closed with one concrete action.",
    cadence: "Friday · 5-minute read · written in Portuguese",
    signupEyebrow: "Radar de Produção",
    signupTitle: "Get the signal, not the noise.",
    signupDescription:
      "A concise issue to decide what to review, test, or monitor during the next week.",
    methodEyebrow: "How it works",
    methodTitle: "Automation with explicit editorial criteria.",
    methods: [
      {
        title: "Primary sources",
        description:
          "Release notes, official blogs, and advisories. Social discovery never becomes evidence.",
      },
      {
        title: "Production impact",
        description:
          "Every item explains what changed, why it matters, and what is worth checking.",
      },
      {
        title: "Safe failure",
        description:
          "Without evidence, valid links, or enough signal, the issue is not published.",
      },
    ],
    archiveEyebrow: "Archive",
    archiveTitle: "Published issues",
    archiveDescription:
      "Every issue remains available here for reference and sharing.",
    empty: "The first published issue will appear here.",
    unavailable:
      "The archive is temporarily unavailable. Signup remains visible but may stay disabled during initial preparation.",
    read: "Read issue",
  },
} as const;

const topics = [
  { icon: Cloud, label: "AWS & Cloud" },
  { icon: Boxes, label: "Kubernetes" },
  { icon: Activity, label: "SRE" },
  { icon: Eye, label: "Observability" },
  { icon: Bot, label: "AI for Ops" },
] as const;

const methodIcons = [Eye, Radar, ShieldCheck] as const;

interface NewsletterLandingProps {
  locale: "pt" | "en";
  apiUrl: string;
  issues: NewsletterIssueSummary[];
  archiveAvailable: boolean;
}

export default function NewsletterLanding({
  locale,
  apiUrl,
  issues,
  archiveAvailable,
}: NewsletterLandingProps) {
  const copy = content[locale];

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border/70 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_22%,hsl(var(--gold)/0.12),transparent_30%)]" />
        <div className="container grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.78fr)] lg:gap-16">
          <div className="max-w-3xl">
            <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {copy.eyebrow}
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl lg:leading-[1.02]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {copy.description}
            </p>

            <div
              className="mt-8 flex flex-wrap gap-2"
              aria-label="Newsletter topics"
            >
              {topics.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border/80 bg-card/55 px-3 text-xs font-medium text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>

            <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
              {copy.cadence}
            </p>
          </div>

          <aside className="relative rounded-2xl border border-gold/25 bg-card/80 p-5 shadow-2xl shadow-black/15 backdrop-blur sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-border/70 pb-5">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold">
                  {copy.signupEyebrow}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  signal_status: ready
                </p>
              </div>
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-40 motion-reduce:animate-none" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {copy.signupTitle}
            </h2>
            <p className="mb-6 mt-3 text-sm leading-6 text-muted-foreground">
              {copy.signupDescription}
            </p>
            <NewsletterSignupForm locale={locale} apiUrl={apiUrl} />
          </aside>
        </div>
      </section>

      <section className="container py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {copy.methodEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.methodTitle}
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.methods.map((method, index) => {
            const Icon = methodIcons[index];
            return (
              <article
                key={method.title}
                className="surface-motion rounded-2xl border border-border/80 bg-card/45 p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{method.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {method.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="arquivo"
        className="border-t border-border/70 py-16 sm:py-20"
      >
        <div className="container">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {copy.archiveEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {copy.archiveTitle}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {copy.archiveDescription}
            </p>
          </div>

          {!archiveAvailable ? (
            <p className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-sm leading-6 text-muted-foreground">
              {copy.unavailable}
            </p>
          ) : issues.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center sm:p-12">
              <Radar className="mx-auto h-7 w-7 text-gold" aria-hidden="true" />
              <p className="mt-4 text-sm text-muted-foreground">{copy.empty}</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {issues.map((issue) => (
                <Link
                  key={issue.issue_id}
                  href={`/newsletter/${issue.issue_id}`}
                  className="surface-motion group rounded-2xl border border-border/80 bg-card/45 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-gold">
                        {issue.issue_id}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight">
                        {issue.title}
                      </h3>
                    </div>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-gold"
                      aria-hidden="true"
                    />
                  </div>
                  {issue.preheader && (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {issue.preheader}
                    </p>
                  )}
                  <span className="mt-5 inline-flex text-sm font-medium text-gold">
                    {copy.read}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

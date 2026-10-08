import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import type { Locale } from "@/app/i18n/settings";
import { getCopy } from "@/lib/locale/copy";
import type { Person } from "@/lib/site-data";
import { CopyButton } from "./copy-button";

export function ContactCta({
  locale,
  person,
}: {
  locale: Locale;
  person: Person;
}) {
  const copy = getCopy(locale);

  return (
    <section aria-labelledby="contato-cta" className="container py-12 lg:py-16">
      <div className="relative isolate overflow-hidden rounded-[2rem] border bg-card px-6 py-12 sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_80%_at_100%_0%,#000_20%,transparent_70%)]" />
          <div className="absolute -right-40 -top-48 h-[34rem] w-[34rem] bg-[radial-gradient(closest-side,hsl(var(--primary)/0.24),transparent)] dark:bg-[radial-gradient(closest-side,hsl(var(--primary)/0.14),transparent)]" />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              {copy.contactCta.eyebrow}
            </p>
            <h2
              id="contato-cta"
              className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl"
            >
              {copy.contactCta.title}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {copy.contactCta.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={person.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-[0_12px_32px_-16px_hsl(var(--primary))] transition-[filter,transform] hover:brightness-105 active:scale-[0.99]"
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span className="flex flex-col leading-tight">
                  <span className="font-semibold">
                    {copy.contactCta.whatsapp}
                  </span>
                  <span className="font-mono text-xs opacity-75">
                    {person.phone}
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            <div className="flex items-center gap-2 rounded-2xl border bg-background/70 py-2 pl-5 pr-2 backdrop-blur">
              <Mail
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <a
                href={`mailto:${person.email}`}
                className="min-w-0 flex-1 truncate py-2 font-medium transition-colors hover:text-brand"
                aria-label={`${copy.contactCta.email}: ${person.email}`}
              >
                {person.email}
              </a>
              <CopyButton
                value={person.email}
                label={copy.copy.copyEmail}
                copiedLabel={copy.copy.copied}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {person.links.linkedin && (
                <a
                  href={person.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-background/70 px-4 py-3 text-sm font-medium backdrop-blur transition-colors hover:border-foreground/25"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  LinkedIn
                </a>
              )}
              {person.links.github && (
                <a
                  href={person.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-background/70 px-4 py-3 text-sm font-medium backdrop-blur transition-colors hover:border-foreground/25"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

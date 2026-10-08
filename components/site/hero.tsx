import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
} from "lucide-react";
import type { Locale } from "@/app/i18n/settings";
import { fill, getCopy } from "@/lib/locale/copy";
import { formatMonthYear } from "@/lib/locale/format";
import type { Career, Person, ProjectView } from "@/lib/site-data";
import { ProfileAvatar } from "./profile-avatar";
import { projectTheme } from "./project-cover";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

interface HeroProps {
  locale: Locale;
  person: Person;
  role: string;
  career: Career;
  projects: ProjectView[];
}

export function Hero({ locale, person, role, career, projects }: HeroProps) {
  const copy = getCopy(locale);
  const city = person.location.split(",")[0];

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bg-grid mask-radial-top absolute inset-0" />
        <div className="absolute left-1/2 top-[-20rem] h-[44rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.2),transparent)] dark:bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent)]" />
      </div>

      <div className="container pb-12 pt-10 sm:pt-16 lg:pb-16 lg:pt-20">
        <div className="animate-enter flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {copy.hero.available}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {city}, BR · UTC−3
          </span>
        </div>

        <h1 className="mt-8 max-w-5xl">
          <span className="animate-enter flex items-center gap-4 [--enter-delay:60ms]">
            <ProfileAvatar src={person.photo} size={72} status priority />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-xl font-semibold tracking-tight sm:text-2xl">
                {person.name}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.16em]">
                {role}
              </span>
            </span>
          </span>
          <span className="animate-enter mt-7 block text-balance text-[2.55rem] font-semibold leading-[1.02] tracking-[-0.04em] [--enter-delay:120ms] sm:text-6xl lg:text-[4.4rem]">
            {person.headline[0]}
            {person.headline[1] && (
              <span className="block font-serif font-normal italic tracking-[-0.015em] text-brand">
                {person.headline[1]}
              </span>
            )}
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
          <div className="animate-enter [--enter-delay:200ms]">
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {person.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={getLocalizedInstitutionalPath(
                  "/portfolio",
                  locale === "pt" ? "pt" : "en",
                )}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_hsl(var(--primary))] transition-[filter,transform] hover:brightness-105 active:scale-[0.98]"
              >
                {copy.hero.ctaProjects}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={person.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border bg-card/70 px-5 text-sm font-semibold backdrop-blur transition-colors hover:border-foreground/25 hover:bg-accent"
              >
                <MessageCircle
                  className="h-4 w-4 text-success"
                  aria-hidden="true"
                />
                {copy.hero.ctaWhatsapp}
              </a>
              <Link
                href={getLocalizedInstitutionalPath(
                  "/resume",
                  locale === "pt" ? "pt" : "en",
                )}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                {copy.hero.ctaResume}
              </Link>
            </div>

            <ul
              className="mt-10 flex items-center gap-2"
              aria-label={copy.footer.elsewhere}
            >
              {[
                person.links.github && {
                  href: person.links.github,
                  label: "GitHub",
                  icon: Github,
                },
                person.links.linkedin && {
                  href: person.links.linkedin,
                  label: "LinkedIn",
                  icon: Linkedin,
                },
                {
                  href: `mailto:${person.email}`,
                  label: person.email,
                  icon: Mail,
                },
              ]
                .filter(
                  (
                    item,
                  ): item is {
                    href: string;
                    label: string;
                    icon: typeof Mail;
                  } => Boolean(item),
                )
                .map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                      aria-label={label}
                      title={label}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <TerminalCard
            locale={locale}
            person={person}
            role={role}
            career={career}
            projects={projects}
          />
        </div>
      </div>
    </section>
  );
}

function Prompt({ command }: { command: string }) {
  return (
    <p className="mt-4 first:mt-0">
      <span className="text-[#faaf2e]" aria-hidden="true">
        ${" "}
      </span>
      <span className="text-zinc-100">{command}</span>
    </p>
  );
}

function TerminalCard({ locale, person, role, career, projects }: HeroProps) {
  const copy = getCopy(locale);
  const company = career.currentRole?.company;
  const focus = person.focus.map((area) => area.title).join(" · ");

  return (
    <figure
      className="animate-enter relative rounded-2xl border border-white/10 bg-[#0e0e11] font-mono text-[12.5px] leading-relaxed text-zinc-400 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] [--enter-delay:280ms] sm:text-[13px]"
      aria-label={`${person.name} — terminal`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span
          className="h-2.5 w-2.5 rounded-full bg-[#f87171]/80"
          aria-hidden="true"
        />
        <span
          className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]/80"
          aria-hidden="true"
        />
        <span
          className="h-2.5 w-2.5 rounded-full bg-[#4ade80]/80"
          aria-hidden="true"
        />
        <span className="ml-2 flex-1 text-center text-[11px] text-zinc-500">
          caio@lombello: ~
        </span>
        <span className="text-[11px] text-zinc-600">zsh</span>
      </div>

      <div className="space-y-0.5 overflow-x-auto px-5 py-5">
        <Prompt command="whoami" />
        <p className="text-zinc-300">
          {person.name} · {role}
          {company ? <span className="text-zinc-500"> @ {company}</span> : null}
        </p>

        {focus && (
          <>
            <Prompt command={`cat ${copy.hero.focusFile}`} />
            <p>{focus}</p>
          </>
        )}

        <Prompt command={`ls ${copy.hero.projectsDir}`} />
        <div className="grid grid-cols-[auto_auto_1fr] gap-x-5">
          {projects.map((project) => (
            <div key={project.id} className="contents">
              <Link
                href={project.href}
                className="underline-offset-4 hover:underline"
                style={{ color: projectTheme(project.id).accent }}
              >
                {project.id}/
              </Link>
              <span className="text-zinc-500">
                {(project.statusLabel ?? "").toLowerCase()}
              </span>
              <span className="truncate text-zinc-600">
                {project.technologies[0]?.toLowerCase()}
              </span>
            </div>
          ))}
        </div>

        {career.firstStart && (
          <>
            <Prompt command="uptime" />
            <p>
              {fill(copy.hero.since, {
                date: formatMonthYear(career.firstStart, locale),
              })}
            </p>
          </>
        )}

        <p className="mt-4">
          <span className="text-[#faaf2e]" aria-hidden="true">
            ${" "}
          </span>
          <span
            className="cursor-blink inline-block h-[1.05em] w-[0.6em] translate-y-[0.18em] bg-zinc-300"
            aria-hidden="true"
          />
        </p>
      </div>
    </figure>
  );
}

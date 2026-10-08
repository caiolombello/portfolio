import { getResumeDownloadFiles } from "@/lib/resume/files";
import CredlyCertifications from "@/components/credly-certifications";
import Link from "next/link";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import type { Metadata } from "next";
import {
  Download,
  FileText,
  GraduationCap,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { CareerTimeline } from "@/components/site/career-timeline";
import { Certifications } from "@/components/site/certifications";
import { SectionHeader } from "@/components/site/section-header";
import {
  LevelLegend,
  SkillMatrix,
  hasSkillLevels,
} from "@/components/site/skill-matrix";
import { getCopy } from "@/lib/locale/copy";
import { contentLocale } from "@/lib/locale/format";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import {
  getCareer,
  getCertifications,
  getEducation,
  getPerson,
  getSkillGroups,
} from "@/lib/site-data";
import { generatePageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: "/resume",
    locale,
    title: locale === "pt" ? "Currículo" : "Resume",
    description:
      locale === "pt"
        ? "Experiência, competências e formação de Caio Barbieri em DevOps, SRE, AWS, Kubernetes, Terraform e engenharia de plataformas."
        : "Caio Barbieri's experience, skills, and education in DevOps, SRE, AWS, Kubernetes, Terraform, and platform engineering.",
  });
}

export default async function ResumePage() {
  const locale = await getCurrentRequestLocale();
  const copy = getCopy(locale);
  const [person, career, education, skills, credentials] = await Promise.all([
    getPerson(locale),
    getCareer(locale),
    getEducation(locale),
    getSkillGroups(locale),
    getCertifications(),
  ]);
  const role = person.role;
  const isPt = contentLocale(locale) === "pt";
  const files = getResumeDownloadFiles(isPt ? "pt" : "en");
  const otherFiles = getResumeDownloadFiles(isPt ? "en" : "pt");

  const contacts = [
    { href: `mailto:${person.email}`, label: person.email, icon: Mail },
    { href: person.whatsappUrl, label: person.phone, icon: MessageCircle },
    person.links.linkedin && {
      href: person.links.linkedin,
      label: person.links.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      icon: Linkedin,
    },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Mail }[];

  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="bg-grid mask-radial-top pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]"
      />

      <div className="container pb-8 pt-12 lg:pt-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            as="h1"
            eyebrow={`${person.name} · ${role}`}
            title={copy.resume.title}
            description={person.about}
          />
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={files.pdf}
              download
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-105"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {copy.resume.downloadPdf}
            </a>
            <a
              href={otherFiles.pdf}
              download
              className="inline-flex h-11 items-center gap-2 rounded-full border bg-card/70 px-4 text-sm font-medium transition-colors hover:border-foreground/25"
            >
              {copy.resume.otherLanguagePdf}
            </a>
            <a
              href={files.markdown}
              download
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {copy.resume.markdown}
            </a>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16">
          <section aria-labelledby="experience-heading" className="min-w-0">
            <h2
              id="experience-heading"
              className="eyebrow mb-8 flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              {copy.resume.experience}
            </h2>
            {career.companies.length > 0 ? (
              <CareerTimeline
                locale={locale}
                companies={career.companies}
                variant="full"
              />
            ) : (
              <p className="rounded-2xl border border-dashed p-8 text-muted-foreground">
                {isPt
                  ? "Nenhuma experiência publicada ainda."
                  : "No experience published yet."}
              </p>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border bg-card p-6">
              <p className="text-lg font-semibold tracking-tight">
                {person.name}
              </p>
              <p className="text-sm text-muted-foreground">{person.title}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {person.location}
                </li>
                {contacts.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {education.length > 0 && (
              <section
                aria-labelledby="education-heading"
                className="rounded-2xl border bg-card p-6"
              >
                <h2
                  id="education-heading"
                  className="eyebrow flex items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  {copy.resume.education}
                </h2>
                <ul className="mt-4 space-y-5">
                  {education.map((item) => (
                    <li key={`${item.institution}-${item.degree}`}>
                      <p className="font-medium leading-snug">{item.degree}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.institution}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground/80">
                        {item.period}
                        {item.completed && (
                          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-success">
                            {copy.resume.completed}
                          </span>
                        )}
                      </p>
                      {item.description && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {person.languages.length > 0 && (
              <section
                aria-labelledby="languages-heading"
                className="rounded-2xl border bg-card p-6"
              >
                <h2
                  id="languages-heading"
                  className="eyebrow flex items-center gap-2"
                >
                  <Languages className="h-4 w-4" aria-hidden="true" />
                  {copy.resume.languages}
                </h2>
                <dl className="mt-4 space-y-3">
                  {person.languages.map((language) => (
                    <div
                      key={language.name}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <dt className="font-medium">{language.name}</dt>
                      <dd className="text-right text-sm text-muted-foreground">
                        {language.level}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            <Link
              href={getLocalizedInstitutionalPath("/contact", locale)}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-105"
            >
              {isPt ? "Entrar em contato" : "Get in touch"}
            </Link>
          </aside>
        </div>

        {skills.length > 0 && (
          <section aria-labelledby="skills-heading" className="mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2
                id="skills-heading"
                className="eyebrow flex items-center gap-3"
              >
                <span aria-hidden="true" className="h-px w-8 bg-primary" />
                {copy.resume.skills}
              </h2>
              {hasSkillLevels(skills) && <LevelLegend locale={locale} />}
            </div>
            <div className="mt-8 rounded-2xl border bg-card p-6 sm:p-8">
              <SkillMatrix skills={skills} />
            </div>
          </section>
        )}

        {(credentials.certifications.length > 0 ||
          credentials.trainingBadges.length > 0 ||
          person.credlyUsername) && (
          <section aria-labelledby="certifications-heading" className="mt-20">
            <h2
              id="certifications-heading"
              className="eyebrow mb-8 flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              {copy.resume.certifications}
            </h2>
            {credentials.certifications.length === 0 &&
            credentials.trainingBadges.length === 0 &&
            person.credlyUsername ? (
              <CredlyCertifications />
            ) : (
              <Certifications
                locale={locale}
                certifications={credentials.certifications}
                trainingBadges={credentials.trainingBadges}
                credlyUsername={person.credlyUsername}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

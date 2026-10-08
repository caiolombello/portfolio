import type { Metadata } from "next";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import ContactForm from "@/components/contact-form";
import { CopyButton } from "@/components/site/copy-button";
import { SectionHeader } from "@/components/site/section-header";
import { getCopy } from "@/lib/locale/copy";
import { getCurrentRequestLocale as getLocale } from "@/lib/request-locale-server";
import { getPerson } from "@/lib/site-data";
import { generatePageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = getCopy(locale);
  return generatePageMetadata({
    title: copy.contact.title,
    description: copy.contact.description,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage() {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const person = await getPerson(locale);

  const socials = [
    person.links.linkedin && {
      href: person.links.linkedin,
      label: copy.contact.linkedin,
      value: person.links.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      icon: Linkedin,
    },
    person.links.github && {
      href: person.links.github,
      label: copy.contact.github,
      value: person.links.github.replace(/^https?:\/\/(www\.)?/, ""),
      icon: Github,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    value: string;
    icon: typeof Mail;
  }[];

  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="bg-grid mask-radial-top pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem]"
      />

      <div className="container pb-8 pt-12 lg:pt-20">
        <SectionHeader
          as="h1"
          eyebrow={copy.contact.eyebrow}
          title={copy.contact.title}
          description={copy.contact.description}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
          <div className="flex flex-col gap-3">
            <a
              href={person.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-[0_16px_40px_-20px_hsl(var(--primary))] transition-[filter,transform] hover:brightness-105 active:scale-[0.99] sm:p-7"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/10">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-8 block font-mono text-xs uppercase tracking-[0.16em] opacity-70">
                {copy.contact.whatsapp}
              </span>
              <span className="mt-1 block text-2xl font-semibold tracking-tight sm:text-3xl">
                {person.phone}
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-3xl border bg-card p-5 sm:p-6">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-background">
                <Mail className="h-5 w-5 text-brand" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="eyebrow">{copy.contact.email}</p>
                <a
                  href={`mailto:${person.email}`}
                  className="mt-1 block truncate text-lg font-semibold tracking-tight transition-colors hover:text-brand"
                >
                  {person.email}
                </a>
              </div>
              <CopyButton
                value={person.email}
                label={copy.copy.copyEmail}
                copiedLabel={copy.copy.copied}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {socials.map(({ href, label, value, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-3xl border bg-card p-5 transition-colors hover:border-foreground/20"
                >
                  <Icon
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="eyebrow block">{label}</span>
                    <span className="mt-1 block truncate text-sm font-medium">
                      {value}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-dashed p-5 text-sm text-muted-foreground">
              <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                <span className="eyebrow block">{copy.contact.location}</span>
                <span className="mt-1 block font-medium text-foreground">
                  {person.location} · UTC−3
                </span>
              </span>
            </div>
          </div>

          <section
            aria-labelledby="form-title"
            className="rounded-3xl border bg-card p-6 sm:p-8"
          >
            <h2
              id="form-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {copy.contact.formTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.contact.formDescription}
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

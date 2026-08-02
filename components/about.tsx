"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Reveal } from "@/components/motion/reveal";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import type { Profile } from "@/types/profile";

interface AboutProps {
  profile: Profile | null;
}

export default function About({ profile }: AboutProps) {
  const { language } = useLanguage();

  if (!profile) return null;

  const currentProfile = profile[language === "en" ? "en" : "pt"];
  const isEnglish = language === "en";
  const copy = isEnglish
    ? {
        eyebrow: "Profile",
        title: "A platform mindset, from the first commit to production.",
        capabilities: "What I bring",
        contact: "Contact details",
        capabilityItems: [
          ["Cloud platforms", "AWS, Oracle Cloud and multi-cloud foundations"],
          [
            "Platform engineering",
            "Kubernetes, IaC, GitOps and reusable paths",
          ],
          [
            "Reliability",
            "Observability, incident readiness and secure defaults",
          ],
          ["Automation", "Python, Go and AI-assisted operations"],
        ],
      }
    : {
        eyebrow: "Perfil",
        title: "Mentalidade de plataforma, do primeiro commit à produção.",
        capabilities: "O que eu entrego",
        contact: "Contato direto",
        capabilityItems: [
          ["Cloud platforms", "AWS, Oracle Cloud e fundações multi-cloud"],
          [
            "Platform engineering",
            "Kubernetes, IaC, GitOps e caminhos reutilizáveis",
          ],
          [
            "Confiabilidade",
            "Observabilidade, prontidão para incidentes e segurança",
          ],
          ["Automação", "Python, Go e operações assistidas por IA"],
        ],
      };

  return (
    <section
      id="about"
      className="container relative border-b border-border/70 py-14 [--timeline-content:3rem] [--timeline-padding:1rem] [--timeline-rail:3rem] sm:py-24 sm:[--timeline-content:5rem] sm:[--timeline-rail:3.5rem]"
      aria-labelledby="about-title"
    >
      <div
        className="timeline-rail absolute bottom-0 left-[var(--timeline-rail)] top-[5.5rem] sm:top-[8.5rem]"
        aria-hidden="true"
      />

      <Reveal className="relative flex items-center gap-4 sm:gap-5" offset={14}>
        <div className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gold/35 bg-secondary sm:h-20 sm:w-20">
          <Image
            src="/api/profile-image"
            alt=""
            fill
            sizes="80px"
            className="object-cover grayscale-[0.1] contrast-[1.04] transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {copy.eyebrow}
          </p>
          <p className="mt-2 truncate text-sm font-semibold text-foreground">
            {currentProfile.name}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {currentProfile.title}
          </p>
        </div>
      </Reveal>

      <div className="pl-[var(--timeline-content)]">
        <div className="mt-7 grid gap-10 sm:mt-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          <Reveal>
            <h2
              id="about-title"
              className="max-w-3xl text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              {copy.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              {currentProfile.about}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-border/70 pt-6">
              <span className="text-sm font-medium text-muted-foreground">
                {copy.contact}
              </span>
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-foreground"
                href={`mailto:${profile.email}`}
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {profile.email}
              </Link>
              <Link
                className="group inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-gold"
                href={getLocalizedInstitutionalPath(
                  "/resume",
                  isEnglish ? "en" : "pt",
                )}
              >
                {isEnglish ? "Read the full resume" : "Ver currículo completo"}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>

          <div className="lg:pt-1">
            <Reveal delay={0.08} offset={14}>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                {copy.capabilities}
              </p>
            </Reveal>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {copy.capabilityItems.map(([label, description], index) => (
                <Reveal key={label} delay={index * 0.06} offset={14}>
                  <div className="surface-motion rounded-xl border border-border/70 bg-card/50 p-4">
                    <p className="text-sm font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

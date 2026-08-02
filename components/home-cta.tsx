"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

export default function HomeCta() {
  const { language } = useLanguage();
  const { config } = useSiteConfig();
  const isEnglish = language === "en";

  return (
    <section
      className="container py-14 sm:py-24"
      aria-labelledby="home-cta-title"
    >
      <Reveal>
        <div className="surface-motion relative overflow-hidden rounded-2xl border border-gold/30 bg-gold/10 px-5 py-8 sm:px-10 sm:py-14">
          <div
            className="ambient-orb pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                {isEnglish ? "Next conversation" : "Próxima conversa"}
              </p>
              <h2
                id="home-cta-title"
                className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
              >
                {isEnglish
                  ? "Need a platform that can keep up with the product?"
                  : "Precisa de uma plataforma que acompanhe o produto?"}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                {isEnglish
                  ? "Tell me what you are building, where reliability is getting in the way, and what a better delivery path looks like."
                  : "Conte o que você está construindo, onde a confiabilidade está travando o time e como seria um caminho de entrega melhor."}
              </p>
            </div>
            <div className="grid w-full gap-3 min-[520px]:flex lg:w-auto lg:flex-wrap">
              <Button
                asChild
                size="lg"
                className="group w-full bg-primary px-5 text-primary-foreground hover:bg-primary/90 min-[520px]:w-auto sm:px-8"
              >
                <Link
                  href={getLocalizedInstitutionalPath(
                    "/contact",
                    isEnglish ? "en" : "pt",
                  )}
                >
                  <Mail aria-hidden="true" />
                  {isEnglish ? "Start a conversation" : "Iniciar conversa"}
                  <ArrowUpRight
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Link
                href={`mailto:${config.site.email}`}
                className="inline-flex min-w-0 items-center self-center break-all text-sm font-medium text-foreground transition-colors hover:text-gold"
              >
                {config.site.email}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

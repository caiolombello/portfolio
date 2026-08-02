"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

function PlatformTopology() {
  const shouldReduceMotion = useReducedMotion();
  const nodes = [
    [112, 278],
    [245, 168],
    [260, 392],
    [398, 236],
    [398, 474],
    [548, 126],
    [528, 414],
    [672, 238],
  ];

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] lg:block"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.18)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_12%,transparent_72%)]" />
      <motion.svg
        viewBox="0 0 760 560"
        className="absolute inset-0 h-full w-full opacity-75"
        fill="none"
        focusable="false"
        animate={shouldReduceMotion ? undefined : { y: [-4, 4, -4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient
            id="topology-line"
            x1="120"
            y1="110"
            x2="650"
            y2="450"
          >
            <stop stopColor="hsl(var(--border))" stopOpacity="0.18" />
            <stop
              offset="0.5"
              stopColor="hsl(var(--gold))"
              stopOpacity="0.72"
            />
            <stop
              offset="1"
              stopColor="hsl(var(--border))"
              stopOpacity="0.16"
            />
          </linearGradient>
          <radialGradient id="topology-node">
            <stop stopColor="hsl(var(--gold))" stopOpacity="0.36" />
            <stop offset="1" stopColor="hsl(var(--gold))" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="url(#topology-line)" strokeWidth="1.25">
          <path d="M112 278 245 168 398 236 548 126 672 238" />
          <path d="M112 278 260 392 398 236 528 414 672 238" />
          <path d="M245 168 260 392M548 126 528 414" strokeDasharray="5 9" />
          <path d="M398 236 398 474" strokeDasharray="3 10" />
        </g>

        <motion.path
          d="M112 278 245 168 398 236 548 126 672 238"
          stroke="hsl(var(--gold))"
          strokeWidth="1.5"
          strokeDasharray="8 18"
          strokeLinecap="round"
          animate={
            shouldReduceMotion ? undefined : { strokeDashoffset: [0, -104] }
          }
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M112 278 260 392 398 236 528 414 672 238"
          stroke="hsl(var(--gold))"
          strokeWidth="1"
          strokeDasharray="3 24"
          strokeLinecap="round"
          animate={
            shouldReduceMotion ? undefined : { strokeDashoffset: [0, -108] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />

        {nodes.map(([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <motion.circle
              cx={cx}
              cy={cy}
              r="34"
              fill="url(#topology-node)"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: [0.45, 0.9, 0.45], scale: [0.9, 1.08, 0.9] }
              }
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              transition={{
                duration: 4.8,
                delay: index * 0.24,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <circle
              cx={cx}
              cy={cy}
              r="5"
              fill="hsl(var(--background))"
              stroke="hsl(var(--gold))"
              strokeWidth="2"
            />
          </g>
        ))}

        <motion.circle
          cx="112"
          cy="278"
          r="4"
          fill="hsl(var(--gold))"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  cx: [112, 245, 398, 548, 672],
                  cy: [278, 168, 236, 126, 238],
                }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <g
          fill="hsl(var(--muted-foreground))"
          fillOpacity="0.54"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="11"
          letterSpacing="1.6"
        >
          <text x="82" y="312">
            COMMIT
          </text>
          <text x="364" y="210">
            PLATFORM
          </text>
          <text x="630" y="272">
            PRODUCTION
          </text>
          <text x="354" y="510">
            OBSERVE
          </text>
        </g>
      </motion.svg>
    </div>
  );
}

export default function Hero() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const locale = isEnglish ? "en" : "pt";

  const copy = isEnglish
    ? {
        eyebrow: "Senior DevOps Engineer · SRE · Platform Engineering",
        title: "Infrastructure that helps teams ship with confidence.",
        description:
          "I turn complex cloud environments into reliable, observable and automated platforms. Hands-on with AWS, Kubernetes, GitOps and DevSecOps.",
        primary: "View experience",
        secondary: "Let's talk",
        location: "Campinas, Brazil · Remote",
        capabilities: [
          ["Cloud platforms", "AWS · multi-account"],
          ["Orchestration", "Kubernetes · EKS"],
          ["Infrastructure as code", "Terraform · GitOps"],
          ["Reliability", "SRE · Observability"],
        ],
      }
    : {
        eyebrow: "Engenheiro DevOps Sênior · SRE · Platform Engineering",
        title: "Infraestrutura que ajuda times a entregar com confiança.",
        description:
          "Transformo ambientes cloud complexos em plataformas confiáveis, observáveis e automatizadas. Atuação hands-on com AWS, Kubernetes, GitOps e DevSecOps.",
        primary: "Ver experiência",
        secondary: "Vamos conversar",
        location: "Campinas, Brasil · Remoto",
        capabilities: [
          ["Cloud platforms", "AWS · multi-account"],
          ["Orquestração", "Kubernetes · EKS"],
          ["Infraestrutura como código", "Terraform · GitOps"],
          ["Confiabilidade", "SRE · Observabilidade"],
        ],
      };

  return (
    <section
      className="relative isolate overflow-hidden border-b border-border/70"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_28%,hsl(var(--gold)/0.12),transparent_31%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)/0.94))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <PlatformTopology />

      <div className="container relative py-14 sm:py-20 lg:py-24">
        <div className="relative z-10 max-w-5xl">
          <Reveal offset={12}>
            <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase leading-5 tracking-[0.16em] text-gold sm:mb-6 sm:text-xs sm:tracking-[0.18em]">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              {copy.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.08} offset={20}>
            <h1
              id="hero-title"
              className="max-w-[15ch] text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-foreground sm:max-w-[18ch] sm:text-5xl lg:max-w-[20ch] lg:text-6xl xl:text-7xl"
            >
              {copy.title}
            </h1>
          </Reveal>
          <Reveal delay={0.16} offset={20}>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-7 sm:text-xl sm:leading-8 lg:max-w-xl">
              {copy.description}
            </p>
          </Reveal>

          <Reveal
            className="mt-8 grid gap-3 min-[480px]:flex min-[480px]:flex-wrap sm:mt-9"
            delay={0.24}
            offset={16}
          >
            <Button
              asChild
              size="lg"
              className="group w-full bg-gold px-5 text-slate-950 shadow-lg shadow-gold/10 hover:bg-gold/90 min-[480px]:w-auto sm:px-8"
            >
              <Link href={getLocalizedInstitutionalPath("/resume", locale)}>
                {copy.primary}
                <ArrowUpRight
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-border/80 bg-background/40 min-[480px]:w-auto"
            >
              <Link href={getLocalizedInstitutionalPath("/contact", locale)}>
                {copy.secondary}
              </Link>
            </Button>
          </Reveal>

          <Reveal
            className="mt-8 text-sm text-muted-foreground sm:mt-10"
            delay={0.3}
            offset={12}
          >
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
              {copy.location}
            </span>
          </Reveal>
        </div>

        <div className="relative z-10 mt-12 grid gap-x-6 gap-y-6 border-t border-border/70 pt-7 min-[480px]:grid-cols-2 sm:mt-16 sm:pt-8 lg:grid-cols-4">
          {copy.capabilities.map(([label, value], index) => (
            <Reveal key={label} delay={0.08 * index} offset={14}>
              <div className="border-l border-gold/35 pl-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

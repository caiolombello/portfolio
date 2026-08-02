"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Reveal } from "@/components/motion/reveal";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  content_pt: string;
  image: string;
  linkedin: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  if (testimonials.length === 0) return null;

  return (
    <section
      className="container border-b border-border/70 py-14 sm:py-24"
      aria-labelledby="recommendations-title"
    >
      <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {isEnglish ? "Recommendations" : "Recomendações"}
          </p>
          <h2
            id="recommendations-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
          >
            {isEnglish
              ? "The way I work matters too."
              : "A forma de trabalhar também importa."}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {isEnglish
            ? "A few words from people who have seen the work up close."
            : "Algumas palavras de quem acompanhou o trabalho de perto."}
        </p>
      </Reveal>

      <Reveal
        className="mt-8 grid min-w-0 gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2"
        delay={0.08}
      >
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="surface-motion group min-w-0 rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-8"
          >
            <Quote
              className="h-7 w-7 text-gold/70 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
              aria-hidden="true"
            />
            <p className="mt-5 text-base leading-7 text-foreground">
              {isEnglish ? testimonial.content : testimonial.content_pt}
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 border-t border-border/70 pt-5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <div className="flex w-full min-w-0 items-center gap-3 min-[420px]:w-auto">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/80 bg-secondary">
                  <Image
                    src={testimonial.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="line-clamp-2 text-xs leading-5 text-muted-foreground min-[420px]:truncate">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              {testimonial.linkedin && (
                <Link
                  href={testimonial.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-gold"
                >
                  LinkedIn{" "}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

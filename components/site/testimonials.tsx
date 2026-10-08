import Image from "next/image";
import { Linkedin } from "lucide-react";
import type { TestimonialView } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function TestimonialGrid({
  testimonials,
  linkedinLabel,
}: {
  testimonials: TestimonialView[];
  linkedinLabel: string;
}) {
  // With an odd count, the first (most recent) recommendation spans the full row
  const featureFirst = testimonials.length % 2 === 1;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {testimonials.map((testimonial, index) => {
        const featured = featureFirst && index === 0;
        const paragraphs = testimonial.quote.split(/\n{2,}/).filter(Boolean);

        return (
          <figure
            key={testimonial.id}
            className={cn(
              "reveal relative flex flex-col rounded-2xl border bg-card p-7 sm:p-9",
              featured && "lg:col-span-2 lg:p-12",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "block font-serif leading-none text-brand",
                featured ? "h-12 text-8xl" : "h-10 text-7xl",
              )}
            >
              “
            </span>
            <blockquote
              className={cn(
                "mt-2 flex-1 text-pretty leading-[1.85] text-foreground/85",
                featured
                  ? "text-base lg:columns-2 lg:gap-12 lg:text-[17px]"
                  : "text-[15.5px]",
              )}
            >
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mb-4 break-inside-avoid-column last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t pt-6">
              {testimonial.image ? (
                <Image
                  src={testimonial.image}
                  alt=""
                  width={featured ? 56 : 48}
                  height={featured ? 56 : 48}
                  className={cn(
                    "shrink-0 rounded-full border object-cover",
                    featured ? "h-14 w-14" : "h-12 w-12",
                  )}
                />
              ) : (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border bg-muted font-semibold">
                  {testimonial.name.charAt(0)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold tracking-tight">
                  {testimonial.name}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
              {testimonial.linkedin && (
                <a
                  href={testimonial.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                  aria-label={`${linkedinLabel}: ${testimonial.name}`}
                  title={linkedinLabel}
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

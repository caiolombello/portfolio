import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  id,
  as = "h2",
  className,
}: SectionHeaderProps) {
  const Heading = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-primary" />
          {eyebrow}
        </p>
        <Heading
          id={id}
          className={cn(
            "mt-4 text-balance font-semibold tracking-[-0.03em]",
            as === "h1"
              ? "text-4xl sm:text-5xl lg:text-6xl"
              : "text-3xl sm:text-4xl",
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/25 hover:bg-accent",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

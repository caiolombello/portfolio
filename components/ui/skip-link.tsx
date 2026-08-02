"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface SkipLinkProps {
  contentId: string;
  className?: string;
  label?: string;
}

export function SkipLink({
  contentId,
  className,
  label = "Skip to main content",
}: SkipLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.getElementById(contentId);
      element?.focus();
      element?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [contentId],
  );

  return (
    <a
      href={`#${contentId}`}
      onClick={handleClick}
      className={cn(
        "fixed left-1/2 top-0 z-[100] -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] whitespace-nowrap rounded-md border border-gold/30 bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-xl transition-transform focus:-translate-x-1/2 focus:translate-y-3 motion-reduce:transition-none",
        className,
      )}
    >
      {label}
    </a>
  );
}

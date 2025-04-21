"use client";

import { useCallback, useState } from "react";
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
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.getElementById(contentId);
      element?.focus();
      element?.scrollIntoView({ behavior: "smooth" });
    },
    [contentId],
  );

  return (
    <a
      href={`#${contentId}`}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "fixed left-4 top-4 z-50 -translate-y-full transform rounded-md bg-primary px-4 py-2 text-primary-foreground transition-transform focus:translate-y-0",
        isFocused && "translate-y-0",
        className,
      )}
    >
      {label}
    </a>
  );
}

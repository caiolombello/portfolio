"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

import type { SiteLocale } from "@/lib/request-locale";

interface CodeBlockProps {
  children: ReactNode;
  code: string;
  language: SiteLocale;
}

type CopyState = "copied" | "error" | "idle";

export default function CodeBlock({
  children,
  code,
  language,
}: CodeBlockProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const isEnglish = language === "en";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  const status =
    copyState === "copied"
      ? isEnglish
        ? "Copied"
        : "Copiado"
      : copyState === "error"
        ? isEnglish
          ? "Copy failed"
          : "Falha ao copiar"
        : null;

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0f141c] text-slate-100 not-prose">
      <button
        type="button"
        onClick={copyCode}
        className="absolute right-2 top-2 z-10 inline-flex min-h-9 items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/90 px-2.5 text-xs text-slate-300 transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={isEnglish ? "Copy code" : "Copiar código"}
      >
        {copyState === "copied" ? (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span>{status || (isEnglish ? "Copy" : "Copiar")}</span>
      </button>
      <pre
        tabIndex={0}
        className="m-0 overflow-x-auto px-4 pb-4 pt-14 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold sm:px-5"
      >
        {children}
      </pre>
      <span className="sr-only" aria-live="polite">
        {status}
      </span>
    </div>
  );
}

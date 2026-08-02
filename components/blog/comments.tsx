"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { buildGiscusAttributes } from "@/lib/giscus";

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

interface CommentsProps {
  lang: "pt" | "en";
}

export default function Comments({ lang }: CommentsProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const attributes = useMemo(
    () =>
      buildGiscusAttributes(
        { repo, repoId, category, categoryId },
        lang,
        "dark",
      ),
    [lang],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !attributes) return;

    container.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    Object.entries(attributes).forEach(([name, value]) =>
      script.setAttribute(name, value),
    );
    container.appendChild(script);

    return () => container.replaceChildren();
  }, [attributes]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container
      .querySelector("script")
      ?.setAttribute("data-theme", theme);

    const updateTheme = () =>
      container.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
        ?.contentWindow?.postMessage(
          { giscus: { setConfig: { theme } } },
          "https://giscus.app",
        );

    updateTheme();
    const timeout = window.setTimeout(updateTheme, 500);
    return () => window.clearTimeout(timeout);
  }, [theme]);

  if (!attributes) return null;

  const isEnglish = lang === "en";

  return (
    <section
      className="mt-10 border-t border-border/70 pt-8 sm:mt-12 sm:pt-10"
      aria-labelledby="comments-title"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
        {isEnglish ? "Discussion" : "Discussão"}
      </p>
      <h2
        id="comments-title"
        className="mb-6 mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
      >
        {isEnglish ? "Continue the conversation" : "Continue a conversa"}
      </h2>
      <div ref={containerRef} id="comments" />
    </section>
  );
}

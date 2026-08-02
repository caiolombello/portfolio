"use client";

import { useLanguage } from "@/contexts/language-context";

export default function PortfolioPageHeader() {
  const { language } = useLanguage();
  return (
    <header className="mb-12 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Portfolio</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
        {language === "en" ? "Projects with a platform mindset." : "Projetos com mentalidade de plataforma."}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">
        {language === "en"
          ? "A curated view of infrastructure, developer experience and automation work. Open a project to see the context, approach and stack."
          : "Uma visão curada de trabalhos em infraestrutura, experiência de desenvolvimento e automação. Abra um projeto para ver contexto, abordagem e stack."}
      </p>
    </header>
  );
}

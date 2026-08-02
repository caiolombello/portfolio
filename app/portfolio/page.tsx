import { getProjectsData } from "@/lib/data";
import PortfolioBrowser from "@/components/portfolio/portfolio-browser";
import PortfolioPageHeader from "@/components/portfolio/portfolio-page-header";
import { generatePageMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const enabled = isPortfolioEnabled(getSiteConfig());
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: "/portfolio",
    locale,
    title: locale === "pt" ? "Projetos" : "Projects",
    description:
      locale === "pt"
        ? "Projetos selecionados de infraestrutura cloud, automação e engenharia de plataformas."
        : "Selected cloud infrastructure, automation, and platform engineering projects.",
    noIndex: !enabled,
  });
}

export default async function PortfolioPage() {
  if (!isPortfolioEnabled(getSiteConfig())) notFound();

  const projects = await getProjectsData();

  return (
    <div className="container py-16 sm:py-20">
      <PortfolioPageHeader />
      <PortfolioBrowser projects={projects} />
    </div>
  );
}

import Resume from "@/components/resume";
import { loadResumeModels } from "@/lib/resume/source";
import { generatePageMetadata } from "@/lib/site-metadata";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: "/resume",
    locale,
    title: locale === "pt" ? "Currículo" : "Resume",
    description:
      locale === "pt"
        ? "Experiência, competências e formação de Caio Barbieri em DevOps, SRE, AWS, Kubernetes, Terraform e engenharia de plataformas."
        : "Caio Barbieri's experience, skills, and education in DevOps, SRE, AWS, Kubernetes, Terraform, and platform engineering.",
  });
}

export default async function ResumePage() {
  const models = loadResumeModels();

  return <Resume models={models} />;
}

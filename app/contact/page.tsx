import Contact from "@/components/contact";
import { getProfileData } from "@/lib/data";
import { generatePageMetadata } from "@/lib/site-metadata";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: "/contact",
    locale,
    title: locale === "pt" ? "Contato" : "Contact",
    description:
      locale === "pt"
        ? "Entre em contato com Caio Barbieri para conversar sobre DevOps, SRE, engenharia de plataformas e oportunidades profissionais."
        : "Contact Caio Barbieri to discuss DevOps, SRE, platform engineering, and professional opportunities.",
  });
}

export default async function ContactPage() {
  const profile = await getProfileData();
  return <Contact profile={profile} />;
}

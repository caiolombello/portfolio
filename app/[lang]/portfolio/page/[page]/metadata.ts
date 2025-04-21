import type { Metadata } from "next";
import { getDictionary } from "@/app/i18n";
import { generatePageMetadata } from "@/components/seo/page-seo";

interface PageProps {
  params: {
    page: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);

  return generatePageMetadata({
    title: dict.projects.title,
    description: dict.projects.description,
    path: `/portfolio`,
    type: "website",
    tags: ["portfolio", "projects"],
  });
}

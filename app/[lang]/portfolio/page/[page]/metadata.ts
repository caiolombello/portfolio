import type { Metadata } from "next";
import { getDictionary } from "@/app/i18n";
import { generatePageMetadata } from "@/lib/site-metadata";

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

  return generatePageMetadata(
    dict.projects.title,
    dict.projects.description
  );
}

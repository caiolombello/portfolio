import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Portfolio - Page ${page}`,
  };
}

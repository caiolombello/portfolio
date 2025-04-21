import { Metadata } from "next";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);
  const cookieStore = await cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value || "en";

  return {
    title:
      language === "en"
        ? `Blog - Page ${pageNumber}`
        : `Blog - Página ${pageNumber}`,
  };
}

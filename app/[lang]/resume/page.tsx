import { Suspense } from "react";
import { Metadata } from "next";
import { getDictionary } from "@/app/i18n";
import ResumeContent from "@/components/resume/resume-content";
import { ResumeSkeleton } from "@/components/loading-skeleton";

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.resume.title,
    description: dict.resume.professionalJourney,
  };
}

export default async function ResumePage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<ResumeSkeleton />}>
        <ResumeContent lang={lang} />
      </Suspense>
    </div>
  );
}

import Resume from "@/components/resume";
import { Suspense } from "react";
import { ResumeSkeleton } from "@/components/loading-skeleton";
import { generatePageMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("Resume");
}

export default function ResumePage() {
  return (
    <Suspense fallback={<ResumeSkeleton />}>
      <Resume />
    </Suspense>
  );
}

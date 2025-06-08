import Resume from "@/components/resume";
import { Suspense } from "react";
import { ResumeSkeleton } from "@/components/loading-skeleton";

export const metadata = {
  title: "Currículo",
  description: "Experiência profissional, educação e habilidades técnicas",
};

export default function ResumePage() {
  return (
    <Suspense fallback={<ResumeSkeleton />}>
      <Resume />
    </Suspense>
  );
}

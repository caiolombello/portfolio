import About from "@/components/about";
import { Suspense } from "react";
import { AboutSkeleton } from "@/components/loading-skeleton";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<AboutSkeleton />}>
        <About />
      </Suspense>
    </div>
  );
}

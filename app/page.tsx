import About from "@/components/about";
import Hero from "@/components/hero";
import { Suspense } from "react";
import { AboutSkeleton } from "@/components/loading-skeleton";
import Testimonials from "@/components/testimonials";
import Portfolio from "@/components/portfolio";
import Blog from "@/components/blog";

import {
  getProfileData,
  getSkillsData,
  getTestimonialsData,
  getProjectsData,
  getPostsData
} from "@/lib/data";

import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "pt";

  const [profile, skills, testimonials, projects, posts] = await Promise.all([
    getProfileData(),
    getSkillsData(),
    getTestimonialsData(),
    getProjectsData(),
    getPostsData(lang)
  ]);

  return (
    <div className="flex flex-col">
      <Hero />
      <Suspense fallback={<AboutSkeleton />}>
        <About profile={profile} skills={skills} />
      </Suspense>
      <Portfolio projects={projects} limit={3} />
      <Blog posts={posts} limit={3} />
      <Testimonials testimonials={testimonials} />
    </div>
  );
}

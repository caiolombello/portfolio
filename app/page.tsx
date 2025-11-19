import About from "@/components/about";
import Hero from "@/components/hero";
import { Suspense } from "react";
import { AboutSkeleton } from "@/components/loading-skeleton";

async function getProfile() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/public/profile`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getSkills() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/skills`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

import Testimonials from "@/components/testimonials";

async function getTestimonials() {
  // In a real app, this would fetch from an API or database
  // For now we import the JSON file directly in the component or fetch it via API route
  // But since we are in a Server Component, we can just read the file or fetch from local API
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/public/testimonials`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const [profile, skills, testimonials] = await Promise.all([
    getProfile(),
    getSkills(),
    getTestimonials()
  ]);

  return (
    <div className="flex flex-col">
      <Hero />
      <Suspense fallback={<AboutSkeleton />}>
        <About profile={profile} skills={skills} />
      </Suspense>
      <Testimonials testimonials={testimonials} />
    </div>
  );
}

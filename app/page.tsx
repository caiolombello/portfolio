import About from "@/components/about";
import Hero from "@/components/hero";
import Testimonials from "@/components/testimonials";
import Portfolio from "@/components/portfolio";
import Blog from "@/components/blog";
import ExperienceSnapshot from "@/components/experience-snapshot";
import HomeCta from "@/components/home-cta";

import {
  getProfileData,
  getTestimonialsData,
  getProjectsData,
  getPostsData,
  getExperiencesData,
} from "@/lib/data";

import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";

export default async function Home() {
  const lang = await getCurrentRequestLocale();
  const portfolioEnabled = isPortfolioEnabled(getSiteConfig());

  const [profile, testimonials, projects, posts, experiences] =
    await Promise.all([
      getProfileData(),
      getTestimonialsData(),
      portfolioEnabled ? getProjectsData() : Promise.resolve([]),
      getPostsData(lang),
      getExperiencesData(),
    ]);

  return (
    <div className="flex flex-col">
      <Hero />
      <About profile={profile} />
      <ExperienceSnapshot experiences={experiences} />
      {portfolioEnabled && projects.length > 0 && (
        <Portfolio projects={projects} limit={3} />
      )}
      <Blog posts={posts} limit={3} />
      <Testimonials testimonials={testimonials} />
      <HomeCta />
    </div>
  );
}

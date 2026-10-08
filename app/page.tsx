import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about-section";
import { CareerTimeline } from "@/components/site/career-timeline";
import { ContactCta } from "@/components/site/contact-cta";
import { PostList } from "@/components/site/post-list";
import { ProjectCard } from "@/components/site/project-card";
import { ArrowLink, SectionHeader } from "@/components/site/section-header";
import { TestimonialGrid } from "@/components/site/testimonials";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import { fill, getCopy } from "@/lib/locale/copy";
import { getCurrentRequestLocale as getLocale } from "@/lib/request-locale-server";
import {
  getCareer,
  getCertifications,
  getPerson,
  getPosts,
  getProjects,
  getSkillGroups,
  getTestimonials,
} from "@/lib/site-data";

export default async function Home() {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const [
    person,
    career,
    projects,
    skills,
    testimonials,
    posts,
    { certifications },
  ] = await Promise.all([
    getPerson(locale),
    getCareer(locale),
    getProjects(locale),
    getSkillGroups(locale),
    getTestimonials(locale),
    getPosts(locale),
    getCertifications(),
  ]);

  const role = person.role;
  const featured = projects.filter((project) => project.featured).slice(0, 5);
  const building = projects.filter((project) => project.status === "alpha");

  return (
    <>
      <Hero
        locale={locale}
        person={person}
        role={role}
        career={career}
        projects={featured.slice(0, 4)}
      />

      <section
        id="projetos"
        aria-labelledby="projetos-title"
        className="container scroll-mt-24 py-16 lg:py-24"
      >
        <SectionHeader
          id="projetos-title"
          eyebrow={copy.sections.projects.eyebrow}
          title={copy.sections.projects.title}
          description={copy.sections.projects.description}
          action={
            <ArrowLink
              href={getLocalizedInstitutionalPath("/portfolio", locale)}
            >
              {copy.sections.projects.viewAll}
            </ArrowLink>
          }
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {featured.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              size={index === 0 ? "large" : "default"}
              className={index === 0 ? "md:col-span-2" : "reveal"}
            />
          ))}
        </div>
      </section>

      <AboutSection
        locale={locale}
        person={person}
        career={career}
        building={building}
        skills={skills}
        certifications={certifications}
      />

      <section
        id="experiencia"
        aria-labelledby="experiencia-title"
        className="scroll-mt-24 border-y border-border/70 bg-muted/30 py-16 lg:py-24"
      >
        <div className="container grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <SectionHeader
            id="experiencia-title"
            eyebrow={copy.sections.experience.eyebrow}
            title={copy.sections.experience.title}
            description={fill(copy.sections.experience.description, {
              years: career.years,
            })}
            action={
              <ArrowLink
                href={getLocalizedInstitutionalPath("/resume", locale)}
              >
                {copy.sections.experience.viewResume}
              </ArrowLink>
            }
            className="md:flex-col md:items-start lg:sticky lg:top-28 lg:self-start"
          />
          <CareerTimeline locale={locale} companies={career.companies} />
        </div>
      </section>

      {testimonials.length > 0 && (
        <section
          aria-labelledby="recomendacoes-title"
          className="container py-16 lg:py-24"
        >
          <SectionHeader
            id="recomendacoes-title"
            eyebrow={copy.sections.testimonials.eyebrow}
            title={copy.sections.testimonials.title}
          />
          <div className="mt-12">
            <TestimonialGrid
              testimonials={testimonials}
              linkedinLabel={copy.sections.testimonials.linkedin}
            />
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section
          aria-labelledby="blog-title"
          className="container pb-12 pt-4 lg:pb-16"
        >
          <SectionHeader
            id="blog-title"
            eyebrow={copy.sections.blog.eyebrow}
            title={copy.sections.blog.title}
            description={copy.sections.blog.description}
            action={
              <ArrowLink href={getLocalizedInstitutionalPath("/blog", locale)}>
                {copy.sections.blog.viewAll}
              </ArrowLink>
            }
          />
          <div className="mt-10">
            <PostList locale={locale} posts={posts.slice(0, 3)} />
          </div>
        </section>
      )}

      <ContactCta locale={locale} person={person} />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type {
  Experience,
  Education,
  Skill,
  Certification,
  SkillCategory,
} from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ResumeContentProps {
  lang: string;
}

export default function ResumeContent({ lang }: ResumeContentProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    certifications: Certification[];
  }>({
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [experiencesRes, educationRes, skillsRes, certificationsRes] =
          await Promise.all([
            fetch(`/api/public/experience?lang=${lang}`),
            fetch(`/api/public/education?lang=${lang}`),
            fetch(`/api/public/skills?lang=${lang}`),
            fetch(`/api/public/certifications?lang=${lang}`),
          ]);

        const [experiences, education, skills, certifications] =
          await Promise.all([
            experiencesRes.json(),
            educationRes.json(),
            skillsRes.json(),
            certificationsRes.json(),
          ]);

        setData({
          experiences,
          education,
          skills,
          certifications,
        });
      } catch (error) {
        console.error("Error fetching resume data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang]);

  const renderExperienceContent = (experience: Experience) => (
    <CardContent>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-4 w-full" />
          ))}
        </div>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {(experience.responsibilities_pt || []).map((item, idx) => (
            <li key={idx}>{item.toString()}</li>
          ))}
        </ul>
      )}
    </CardContent>
  );

  const renderEducationContent = (edu: Education) => (
    <>
      {loading ? (
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      ) : (
        edu.description_pt && (
          <CardContent>
            <p>{edu.description_pt}</p>
          </CardContent>
        )
      )}
    </>
  );

  return (
    <div className="space-y-8">
      {/* Professional Experience */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {t("resume.experience.title")}
        </h2>
        <div className="space-y-4">
          {(loading ? Array.from({ length: 3 }) : data.experiences).map(
            (item, index) => {
              const experience = loading
                ? ({} as Experience)
                : (item as Experience);
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>
                      {loading ? (
                        <Skeleton className="h-6 w-3/4" />
                      ) : (
                        experience.title_pt
                      )}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {loading ? (
                        <Skeleton className="h-4 w-1/2" />
                      ) : (
                        `${experience.company} • ${experience.period}`
                      )}
                    </div>
                  </CardHeader>
                  {loading ? (
                    <CardContent>
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-4 w-full" />
                        ))}
                      </div>
                    </CardContent>
                  ) : (
                    renderExperienceContent(experience)
                  )}
                </Card>
              );
            },
          )}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {t("resume.education.title")}
        </h2>
        <div className="space-y-4">
          {(loading ? Array.from({ length: 2 }) : data.education).map(
            (item, index) => {
              const edu = loading ? ({} as Education) : (item as Education);
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>
                      {loading ? (
                        <Skeleton className="h-6 w-3/4" />
                      ) : (
                        edu.degree_pt
                      )}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {loading ? (
                        <Skeleton className="h-4 w-1/2" />
                      ) : (
                        `${edu.institution} • ${edu.period}`
                      )}
                    </div>
                  </CardHeader>
                  {loading ? (
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  ) : (
                    renderEducationContent(edu)
                  )}
                </Card>
              );
            },
          )}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t("resume.skills.title")}</h2>
        <Tabs defaultValue="technical">
          <TabsList>
            <TabsTrigger value="technical">
              {t("resume.skills.technical")}
            </TabsTrigger>
            <TabsTrigger value="soft">{t("resume.skills.soft")}</TabsTrigger>
          </TabsList>
          <TabsContent value="technical">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))
                : data.skills
                    .filter(
                      (skill) => skill.category.toLowerCase() === "technical",
                    )
                    .map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-medium">{skill.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{skill.level}</Badge>
                        </div>
                      </div>
                    ))}
            </div>
          </TabsContent>
          <TabsContent value="soft">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))
                : data.skills
                    .filter((skill) => skill.category.toLowerCase() === "soft")
                    .map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-medium">{skill.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{skill.level}</Badge>
                        </div>
                      </div>
                    ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {t("resume.certifications.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))
            : data.certifications.map((cert, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {cert.issuer} • {cert.date}
                    </div>
                  </CardHeader>
                </Card>
              ))}
        </div>
      </section>

      {/* Download Resume Button */}
      <div className="flex justify-center mt-8">
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          {t("resume.downloadResume")}
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import ExperienceItem from "./experience-item";
import { useLanguage } from "@/contexts/language-context";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface ExperienceData {
  pt: Experience[];
  en: Experience[];
  es: Experience[];
}

export default function Experience() {
  const { language = "pt" } = useLanguage() || {};
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/public/experience");
        if (!response.ok) {
          throw new Error("Failed to fetch experiences");
        }
        const data: ExperienceData = await response.json();
        setExperiences(data[language] || []);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError("Failed to load experiences");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [language]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <ExperienceItem key={index} {...experience} />
      ))}
    </div>
  );
}

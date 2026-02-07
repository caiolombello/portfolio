"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import Image from "next/image";

interface ExperienceItemProps {
  title: string;
  company: string;
  logo?: string;
  companyUrl?: string;
  period: string;
  responsibilities: string[];
  index: number;
}

export default function ExperienceItem({
  title,
  company,
  logo,
  companyUrl,
  period,
  responsibilities,
  index,
}: ExperienceItemProps) {
  const [imgError, setImgError] = useState(false);
  const showLogo = logo && !imgError;
  const companyName = companyUrl ? (
    <a
      href={companyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-gold transition-colors underline-offset-2 hover:underline"
    >
      {company}
    </a>
  ) : (
    company
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative pl-10 md:pl-14"
    >
      {/* Timeline line */}
      <div className="absolute left-[15px] md:left-[19px] top-0 bottom-0 w-px bg-gold/20" />

      {/* Timeline dot */}
      {showLogo ? (
        <div className="absolute left-0 md:left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-background overflow-hidden">
          <Image
            src={logo}
            alt={`${company} logo`}
            width={32}
            height={32}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="absolute left-0 md:left-1 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-background">
          <Briefcase className="h-4 w-4 text-gold" />
        </div>
      )}

      {/* Card */}
      <div className="rounded-lg border border-border/40 bg-card p-6 ml-2 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground whitespace-nowrap">
            {period}
          </span>
        </div>
        <p className="mb-4 text-lg text-gold/80">{companyName}</p>
        <ul className="space-y-2 text-muted-foreground">
          {responsibilities.map((responsibility, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{responsibility}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

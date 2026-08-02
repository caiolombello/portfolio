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
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative pl-10 md:pl-14"
    >
      {/* Timeline line */}
      <div className="absolute bottom-0 left-[15px] top-0 w-px bg-border md:left-[19px]" />

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
          <Briefcase className="h-4 w-4 text-gold" aria-hidden="true" />
        </div>
      )}

      {/* Card */}
      <div className="ml-2 rounded-xl border border-border/70 bg-card/40 p-5 transition-colors duration-300 hover:border-gold/40 sm:p-6">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h3>
          <span className="w-fit rounded-full border border-border/80 bg-secondary/60 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {period}
          </span>
        </div>
        <p className="mb-4 text-sm font-medium text-gold">{companyName}</p>
        <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
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

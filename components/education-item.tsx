"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

interface EducationItemProps {
  degree: string;
  institution: string;
  logo?: string;
  institutionUrl?: string;
  period: string;
  description?: string;
  index: number;
}

export default function EducationItem({
  degree,
  institution,
  logo,
  institutionUrl,
  period,
  description,
  index,
}: EducationItemProps) {
  const [imgError, setImgError] = useState(false);
  const showLogo = logo && !imgError;
  const institutionName = institutionUrl ? (
    <a
      href={institutionUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-gold transition-colors underline-offset-2 hover:underline"
    >
      {institution}
    </a>
  ) : (
    institution
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
            alt={`${institution} logo`}
            width={32}
            height={32}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="absolute left-0 md:left-1 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-background">
          <GraduationCap className="h-4 w-4 text-gold" aria-hidden="true" />
        </div>
      )}

      {/* Card */}
      <div className="ml-2 rounded-xl border border-border/70 bg-card/40 p-5 transition-colors duration-300 hover:border-gold/40 sm:p-6">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{degree}</h3>
          <span className="w-fit rounded-full border border-border/80 bg-secondary/60 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {period}
          </span>
        </div>
        <p className="mb-4 text-sm font-medium text-gold">{institutionName}</p>
        {description && <p className="text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
    </motion.div>
  );
}

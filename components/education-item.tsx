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
            alt={`${institution} logo`}
            width={32}
            height={32}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="absolute left-0 md:left-1 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-background">
          <GraduationCap className="h-4 w-4 text-gold" />
        </div>
      )}

      {/* Card */}
      <div className="rounded-lg border border-border/40 bg-card p-6 ml-2 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-xl font-semibold text-foreground">{degree}</h3>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground whitespace-nowrap">
            {period}
          </span>
        </div>
        <p className="mb-4 text-lg text-gold/80">{institutionName}</p>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </motion.div>
  );
}

"use client"

import { useLanguage } from "@/contexts/language-context"

interface SectionHeadingProps {
  title: string
}

export default function SectionHeading({ title }: SectionHeadingProps) {
  const { t } = useLanguage()

  return (
    <div className="mb-8 flex items-center">
      <div className="h-0.5 flex-grow bg-gold/20"></div>
      <h2 className="mx-4 text-2xl font-bold text-gold">{title}</h2>
      <div className="h-0.5 flex-grow bg-gold/20"></div>
    </div>
  )
}


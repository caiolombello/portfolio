import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  icon?: LucideIcon;
}

export default function SectionHeading({ title, icon: Icon }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center gap-3 border-b border-border/70 pb-4">
      {Icon && <Icon className="h-4 w-4 text-gold" aria-hidden="true" />}
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
    </div>
  );
}

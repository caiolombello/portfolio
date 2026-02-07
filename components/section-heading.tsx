import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  icon?: LucideIcon;
}

export default function SectionHeading({ title, icon: Icon }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center">
      <div className="h-0.5 flex-grow bg-gold/20" />
      <div className="mx-4 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-gold" />}
        <h2 className="text-2xl font-bold text-gold">{title}</h2>
      </div>
      <div className="h-0.5 flex-grow bg-gold/20" />
    </div>
  );
}

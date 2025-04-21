interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export default function ExperienceItem({
  title,
  company,
  period,
  responsibilities,
}: ExperienceItemProps) {
  return (
    <div className="rounded-lg border border-border/40 bg-card p-6">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
          {period}
        </span>
      </div>
      <p className="mb-4 text-lg text-muted-foreground">{company}</p>
      <ul className="space-y-2 text-muted-foreground">
        {responsibilities.map((responsibility, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"></span>
            <span>{responsibility}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

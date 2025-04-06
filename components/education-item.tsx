interface EducationItemProps {
  degree: string
  institution: string
  period: string
  description: string
}

export default function EducationItem({ degree, institution, period, description }: EducationItemProps) {
  return (
    <div className="rounded-lg border border-border/40 bg-card p-6">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-xl font-semibold text-foreground">{degree}</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">{period}</span>
      </div>
      <p className="mb-2 text-lg text-muted-foreground">{institution}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}


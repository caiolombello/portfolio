import type { Locale } from "@/app/i18n/settings";
import { getCopy } from "@/lib/locale/copy";
import type { CompanyView } from "@/lib/site-data";
import { cn } from "@/lib/utils";

interface CareerTimelineProps {
  locale: Locale;
  companies: CompanyView[];
  variant?: "compact" | "full";
}

export function CareerTimeline({
  locale,
  companies,
  variant = "compact",
}: CareerTimelineProps) {
  const copy = getCopy(locale);
  const full = variant === "full";

  return (
    <ol className="relative">
      {companies.map((company, index) => {
        const last = index === companies.length - 1;
        return (
          <li
            key={`${company.company}-${index}`}
            className="reveal grid grid-cols-1 gap-3 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10"
          >
            <div className="md:pt-1">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {company.period}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground/70">
                {company.duration}
              </p>
            </div>

            <div
              className={cn(
                "relative border-l border-border pl-7 md:pl-9",
                !last && "pb-12",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[6px] top-1.5 h-[11px] w-[11px] rounded-full border-2 border-background",
                  company.current
                    ? "bg-success ring-4 ring-success/15"
                    : "bg-muted-foreground/50",
                )}
              />
              <h3 className="flex flex-wrap items-center gap-3 text-xl font-semibold tracking-tight">
                {company.company}
                {company.current && (
                  <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-success">
                    {copy.resume.present}
                  </span>
                )}
              </h3>

              <ol className={cn("mt-4", full ? "space-y-8" : "space-y-3")}>
                {company.roles.map((role) => (
                  <li key={`${role.title}-${role.period}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <p
                        className={cn(
                          "font-medium",
                          full ? "text-base" : "text-[15px] text-foreground/90",
                        )}
                      >
                        {role.title}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {role.period}
                        <span className="text-muted-foreground/60">
                          {" "}
                          · {role.duration}
                        </span>
                      </p>
                    </div>
                    {role.summary && (
                      <p
                        className={cn(
                          "mt-2 text-pretty leading-relaxed",
                          full
                            ? "text-[15px] text-foreground/80"
                            : "text-sm text-muted-foreground",
                        )}
                      >
                        {role.summary}
                      </p>
                    )}
                    {full && role.responsibilities.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {role.responsibilities.map((item) => (
                          <li
                            key={item}
                            className="relative pl-5 text-[15px] leading-relaxed text-muted-foreground"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-[0.7em] h-1 w-2.5 rounded-full bg-primary/60"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

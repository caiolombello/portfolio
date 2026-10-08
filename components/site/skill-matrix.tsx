import type { Locale } from "@/app/i18n/settings";
import { getCopy } from "@/lib/locale/copy";
import type { SkillGroup } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { TechIcon } from "./tech-icon";

const LEVEL_BARS: Record<string, number> = {
  Avançado: 3,
  Experiente: 2,
  Proficiente: 1,
  Familiarizado: 1,
  Iniciante: 1,
};

export function SkillMatrix({ skills }: { skills: SkillGroup[] }) {
  return (
    <dl className="divide-y divide-border/70">
      {skills.map((group) => (
        <div
          key={group.key}
          className="grid grid-cols-1 gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-6"
        >
          <dt className="eyebrow pt-1.5">{group.label}</dt>
          <dd>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                // "AWS (EKS, ECS, EC2)" → main chip text + its services
                const match = /^(.+?)\s*\((.+,.+)\)$/.exec(skill.name);
                const main = match ? match[1] : skill.name;
                const detail = match
                  ? match[2].split(/\s*,\s*/).join(" · ")
                  : undefined;
                return (
                  <li
                    key={skill.name}
                    title={
                      skill.levelLabel
                        ? `${skill.name} — ${skill.levelLabel}`
                        : skill.name
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 py-1.5 pl-2.5 pr-3 text-sm"
                  >
                    <TechIcon
                      name={main}
                      className="h-3.5 w-3.5 text-muted-foreground"
                    />
                    {main}
                    {detail && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {detail}
                      </span>
                    )}
                    {skill.level && skill.levelLabel && (
                      <LevelBars
                        level={LEVEL_BARS[skill.level] ?? 1}
                        label={skill.levelLabel}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function LevelBars({ level, label }: { level: number; label: string }) {
  return (
    <span
      className="ml-0.5 inline-flex items-end gap-[2px]"
      aria-label={label}
      role="img"
    >
      {[1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={cn(
            "w-[3px] rounded-full",
            bar <= level ? "bg-brand" : "bg-border",
          )}
          style={{ height: `${4 + bar * 3}px` }}
        />
      ))}
    </span>
  );
}

export function hasSkillLevels(skills: SkillGroup[]): boolean {
  return skills.some((group) =>
    group.skills.some((skill) => Boolean(skill.level)),
  );
}

export function LevelLegend({ locale }: { locale: Locale }) {
  const levels = getCopy(locale).resume.levels;
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {(["Avançado", "Experiente", "Proficiente"] as const).map((level) => (
        <span key={level} className="inline-flex items-center gap-1.5">
          <LevelBars level={LEVEL_BARS[level]} label={levels[level]} />
          <span aria-hidden="true">{levels[level]}</span>
        </span>
      ))}
    </p>
  );
}

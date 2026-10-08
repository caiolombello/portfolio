import Image from "next/image";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import type { Locale } from "@/app/i18n/settings";
import { fill, getCopy } from "@/lib/locale/copy";
import { formatMonthYear } from "@/lib/locale/format";
import type { CertificationView } from "@/lib/site-data";

interface CertificationsProps {
  locale: Locale;
  certifications: CertificationView[];
  trainingBadges?: CertificationView[];
  credlyUsername?: string;
}

function BadgeImage({
  badge,
  size,
}: {
  badge: CertificationView;
  size: number;
}) {
  if (!badge.image) {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-xl border bg-muted"
        style={{ width: size, height: size }}
      >
        <BadgeCheck className="h-6 w-6 text-brand" aria-hidden="true" />
      </span>
    );
  }
  return (
    <Image
      src={badge.image}
      alt=""
      width={size}
      height={size}
      className="shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function Certifications({
  locale,
  certifications,
  trainingBadges = [],
  credlyUsername,
}: CertificationsProps) {
  const copy = getCopy(locale).resume;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {certifications.map((cert) => (
          <li key={cert.name}>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-foreground/20 sm:p-5"
              aria-label={`${cert.name} — ${copy.credlyVerify}`}
            >
              <BadgeImage badge={cert} size={64} />
              <span className="min-w-0">
                <span className="block font-medium leading-snug transition-colors group-hover:text-brand">
                  {cert.name}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {cert.issuer}
                </span>
                {cert.expiresAt && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[10.5px] text-success">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    {fill(copy.validUntil, {
                      date: formatMonthYear(cert.expiresAt, locale),
                    })}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {trainingBadges.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow">{copy.trainingBadges}</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {trainingBadges.map((badge) => (
              <li key={badge.name}>
                <a
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border bg-card py-1.5 pl-1.5 pr-4 text-sm transition-colors hover:border-foreground/20"
                >
                  <BadgeImage badge={badge} size={32} />
                  <span className="font-medium group-hover:text-brand">
                    {badge.name}
                  </span>
                  <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                    {badge.issuer}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {credlyUsername && (
        <a
          href={`https://www.credly.com/users/${credlyUsername}/badges`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {copy.credlyAll}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

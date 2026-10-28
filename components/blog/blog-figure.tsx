import {
  NARROW_FIGURE_MEDIA,
  type BlogFigure as BlogFigureData,
  type FigureAsset,
} from "@/lib/blog-figures";
import type { SiteLocale } from "@/lib/request-locale";
import { cn } from "@/lib/utils";

interface BlogFigureProps {
  figure: BlogFigureData;
  alt: string;
  language: SiteLocale;
}

interface FigurePictureProps {
  wide: FigureAsset;
  narrow?: FigureAsset;
  alt: string;
  openLabel: string;
  className?: string;
}

function FigurePicture({
  wide,
  narrow,
  alt,
  openLabel,
  className,
}: FigurePictureProps) {
  return (
    <a
      href={wide.src}
      className={cn(
        "block",
        // Phones: the narrow layout bleeds to the screen edges below 480 px
        // (its text stays at ~11 px or more) and is capped in width above it.
        narrow &&
          "max-[479px]:-mx-5 min-[480px]:max-sm:mx-auto min-[480px]:max-sm:max-w-[28rem]",
        className,
      )}
    >
      <picture>
        {narrow && (
          <source
            media={NARROW_FIGURE_MEDIA}
            srcSet={narrow.src}
            width={narrow.width}
            height={narrow.height}
          />
        )}
        <img
          src={wide.src}
          width={wide.width}
          height={wide.height}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-auto w-full",
            narrow && "max-[479px]:!rounded-none max-[479px]:!border-x-0",
          )}
        />
      </picture>
      <span className="sr-only">{openLabel}</span>
    </a>
  );
}

/**
 * Renders a registered figure with plain <picture>/<img>: next/image does not
 * support art direction, and static SVGs gain nothing from its optimizer.
 * Each theme gets its own <picture>; the hidden one is display:none, so its
 * lazy image is never fetched and stays out of the accessibility tree. Theme
 * follows the site's class-based toggle, not prefers-color-scheme.
 */
export default function BlogFigure({ figure, alt, language }: BlogFigureProps) {
  const openLabel =
    language === "pt"
      ? "(abre a figura em tamanho real)"
      : "(opens the full-size figure)";
  const { wide, narrow } = figure;

  if (!wide.dark) {
    return (
      <FigurePicture
        wide={wide.light}
        narrow={narrow?.light}
        alt={alt}
        openLabel={openLabel}
      />
    );
  }

  return (
    <>
      <FigurePicture
        wide={wide.light}
        narrow={narrow?.light}
        alt={alt}
        openLabel={openLabel}
        className="dark:hidden"
      />
      <FigurePicture
        wide={wide.dark}
        narrow={narrow?.dark ?? narrow?.light}
        alt={alt}
        openLabel={openLabel}
        className="hidden dark:block"
      />
    </>
  );
}

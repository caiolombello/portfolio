import fs from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import { getPerson } from "@/lib/site-data";
import { getSiteConfig } from "@/lib/config-server";
import type { SiteLocale } from "@/lib/request-locale";

/**
 * Shared Open Graph layout in the site's identity (near-black, grid, amber
 * accent, Geist + Instrument Serif). Used by every opengraph-image route.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BASE = {
  bg: "#0b0b0c",
  text: "#f5f3ee",
  muted: "#a1a1aa",
  accent: "#faaf2e",
};

export interface OgTheme {
  bg: string;
  accent: string;
}

export interface OgOptions {
  locale?: SiteLocale;
  eyebrow: string;
  title: string;
  subtitle?: string;
  chips?: string[];
  /** Shown bottom-right, e.g. "caio.lombello.com/portfolio/falatrace" */
  url?: string;
  theme?: OgTheme;
}

// Fonts live in the repo (OFL, see assets/fonts) so rendering never depends on the network
const FONT_FILES = [
  { name: "Geist", file: "Geist-SemiBold.ttf", weight: 600, style: "normal" },
  { name: "Geist Mono", file: "GeistMono-Medium.ttf", weight: 500, style: "normal" },
  { name: "Instrument Serif", file: "InstrumentSerif-Italic.ttf", weight: 400, style: "italic" },
] as const;

async function loadFonts() {
  return Promise.all(
    FONT_FILES.map(async (font) => {
      const data = await fs.readFile(path.join(process.cwd(), "assets/fonts", font.file));
      return { name: font.name, data, weight: font.weight, style: font.style };
    }),
  );
}

function rgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

async function loadPhoto(src: string): Promise<string | null> {
  if (!src.startsWith("/") || src.startsWith("/api/")) return null;
  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.resolve(publicDir, `.${src}`);
  if (!filePath.startsWith(`${publicDir}${path.sep}`)) return null;
  try {
    const file = await fs.readFile(filePath);
    const type = src.endsWith(".png") ? "png" : src.endsWith(".webp") ? "webp" : "jpeg";
    return `data:image/${type};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

function titleSize(title: string) {
  if (title.length > 88) return 46;
  if (title.length > 62) return 50;
  if (title.length > 48) return 54;
  if (title.length > 30) return 64;
  return 80;
}

export async function renderOgImage({ locale = "pt", eyebrow, title, subtitle, chips = [], url, theme }: OgOptions) {
  const person = await getPerson(locale);
  const host = new URL(getSiteConfig().site.url).host;
  const accent = theme?.accent ?? BASE.accent;
  const bg = theme?.bg ?? BASE.bg;
  const footerUrl = url ?? host;
  const visibleChips = chips.filter(Boolean).slice(0, 4).map((chip) => chip.length > 24 ? `${chip.slice(0, 23)}…` : chip);
  const visibleSubtitle = subtitle && subtitle.length > 170 ? `${subtitle.slice(0, 167)}…` : subtitle;

  const [photo, fonts] = await Promise.all([loadPhoto(person.photo), loadFonts()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: bg,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: BASE.text,
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            display: "flex",
            borderRadius: 9999,
            backgroundImage: `radial-gradient(circle, ${rgba(accent, 0.28)} 0%, ${rgba(accent, 0)} 70%)`,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                width={72}
                height={72}
                alt=""
                style={{ borderRadius: 9999, border: "2px solid rgba(255,255,255,0.14)" }}
              />
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>{person.name}</span>
              <span
                style={{
                  fontFamily: "Geist Mono",
                  fontSize: 17,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: BASE.muted,
                }}
              >
                {person.role}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 9999,
              border: "1px solid rgba(74,222,128,0.35)",
              backgroundColor: "rgba(74,222,128,0.1)",
              color: "#4ade80",
              fontFamily: "Geist Mono",
              fontSize: 16,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: "#4ade80", display: "flex" }} />
            {host}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 20,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: titleSize(title),
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              maxWidth: 1020,
            }}
          >
            {title}
          </span>
          {visibleSubtitle ? (
            <span
              style={{
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontSize: (visibleSubtitle?.length ?? 0) > 90 ? 32 : 40,
                lineHeight: 1.15,
                color: accent,
                marginTop: 14,
                maxWidth: 1020,
              }}
            >
              {visibleSubtitle}
            </span>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10, maxWidth: 650 }}>
            {visibleChips.map((chip) => (
              <span
                key={chip}
                style={{
                  display: "flex",
                  padding: "9px 18px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  fontFamily: "Geist Mono",
                  fontSize: 17,
                  color: "#d4d4d8",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
          {url ? (
            <span style={{ fontFamily: "Geist Mono", fontSize: 14, color: BASE.muted, maxWidth: 390, textAlign: "right" }}>{footerUrl}</span>
          ) : null}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

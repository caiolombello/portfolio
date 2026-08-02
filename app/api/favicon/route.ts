import { ImageResponse } from "next/og";
import { createElement } from "react";
import type { ReactElement } from "react";
import { getSiteConfig } from "@/lib/config-server";
import { resolveProfileImage } from "@/lib/profile-image";

const DEFAULT_SIZE = 32;
const MIN_SIZE = 16;
const MAX_SIZE = 512;
const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

function getRequestedSize(value: string | null): number {
  const parsedSize = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsedSize)) {
    return DEFAULT_SIZE;
  }

  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, parsedSize));
}

function fallbackIcon(size: number) {
  return createElement(
    "div",
    {
      style: {
        alignItems: "center",
        background: "linear-gradient(135deg, #ffd700, #ffa500)",
        border: `${Math.max(1, Math.round(size / 50))}px solid #333`,
        borderRadius: "50%",
        color: "#333",
        display: "flex",
        fontFamily: "sans-serif",
        fontSize: size * 0.46,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      },
    },
    "C",
  );
}

export async function GET(request: Request) {
  const size = getRequestedSize(new URL(request.url).searchParams.get("size"));
  let icon: ReactElement = fallbackIcon(size);

  try {
    const config = getSiteConfig();
    const profileImage = await resolveProfileImage(config.site.profileImage, { size });

    if (profileImage) {
      const source = `data:${profileImage.contentType};base64,${profileImage.buffer.toString("base64")}`;
      icon = createElement("img", {
        alt: "",
        src: source,
        style: {
          height: "100%",
          objectFit: "cover",
          width: "100%",
        },
      });
    }
  } catch (error) {
    // The generated icon below remains available if configuration or image I/O fails.
    console.error("Unable to load the profile image for the favicon:", error);
  }

  // ImageResponse uses Next.js' portable renderer and always emits a real PNG.
  // This avoids loading Sharp's platform-specific native binary in the function.
  return new ImageResponse(icon, {
    width: size,
    height: size,
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });
}

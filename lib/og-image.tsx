import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

interface OgImageOptions {
  eyebrow: string;
  title: string;
  description?: string;
  tags?: string[];
  path?: string;
}

function titleSize(title: string): number {
  if (title.length > 88) return 50;
  if (title.length > 62) return 58;
  return 68;
}

export function createOgImage({
  eyebrow,
  title,
  description,
  tags = [],
  path = "/",
}: OgImageOptions): ImageResponse {
  const visibleTags = tags.filter(Boolean).slice(0, 4);
  const visibleDescription = description
    ? description.length > 170
      ? `${description.slice(0, 167)}…`
      : description
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "54px 64px 46px",
          background:
            "linear-gradient(135deg, #0d1118 0%, #0b0f15 58%, #12151b 100%)",
          color: "#f7f3eb",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(217, 174, 106, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 174, 106, 0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            display: "flex",
            background: "#d9ae6a",
          }}
        />

        <header
          style={{
            display: "flex",
            width: "100%",
            minWidth: 0,
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexShrink: 0, alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "9px",
                height: "9px",
                display: "flex",
                borderRadius: "50%",
                background: "#d9ae6a",
              }}
            />
            <span
              style={{
                display: "flex",
                flexShrink: 0,
                whiteSpace: "nowrap",
                color: "#d9ae6a",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "3px",
              }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </div>
          <div
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(217, 174, 106, 0.35)",
              borderRadius: "16px",
              background: "rgba(217, 174, 106, 0.08)",
              color: "#d9ae6a",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            CB
          </div>
        </header>

        <main
          style={{
            display: "flex",
            width: "100%",
            minWidth: 0,
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "1040px",
            position: "relative",
          }}
        >
          <h1
            style={{
              margin: 0,
              width: "100%",
              maxWidth: "1020px",
              minWidth: 0,
              color: "#f7f3eb",
              fontSize: `${titleSize(title)}px`,
              fontWeight: 700,
              letterSpacing: "-2.2px",
              lineHeight: 1.06,
            }}
          >
            {title}
          </h1>
          {visibleDescription && (
            <p
              style={{
                margin: "22px 0 0",
                maxWidth: "940px",
                color: "#aeb4bf",
                fontSize: "25px",
                lineHeight: 1.38,
              }}
            >
              {visibleDescription}
            </p>
          )}
          {visibleTags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "28px",
              }}
            >
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "flex",
                    padding: "9px 16px",
                    border: "1px solid rgba(217, 174, 106, 0.24)",
                    borderRadius: "999px",
                    background: "rgba(217, 174, 106, 0.07)",
                    color: "#d9ae6a",
                    fontSize: "17px",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </main>

        <footer
          style={{
            display: "flex",
            width: "100%",
            minWidth: 0,
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.09)",
            color: "#7f8793",
            fontSize: "17px",
            position: "relative",
          }}
        >
          <span style={{ display: "flex", fontWeight: 600 }}>
            Caio Barbieri · DevOps &amp; SRE
          </span>
          <span style={{ display: "flex", maxWidth: "520px", fontFamily: "monospace", fontSize: "15px" }}>
            caio.lombello.com{path === "/" ? "" : path}
          </span>
        </footer>
      </div>
    ),
    OG_SIZE,
  );
}

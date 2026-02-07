import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getSiteConfigEdge } from "@/lib/config-edge";

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  try {
    if (!uint8Array || uint8Array.length === 0) return '';
    return Buffer.from(uint8Array).toString('base64');
  } catch {
    return '';
  }
}

async function loadProfileImage(imageUrl: string, baseUrl: string) {
  try {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
    const response = await fetch(fullUrl);
    if (!response.ok) return null;
    return new Uint8Array(await response.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const host = request.headers.get('host') || '';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    let baseUrl = `${protocol}://${host}`;
    if (!host && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }

    const config = await getSiteConfigEdge(baseUrl);

    const title = searchParams.get("title") || config.site.shortName;
    const subtitle = searchParams.get("subtitle") || config.site.description;
    const isHomepage = !searchParams.get("title");

    // Load profile image for homepage
    let profileImageData: Uint8Array | null = null;
    if (isHomepage) {
      const profileImageConfig = config.site.profileImage;
      if (typeof profileImageConfig === 'object' && profileImageConfig.type) {
        if (profileImageConfig.type === 'github') {
          profileImageData = await loadProfileImage(`https://github.com/${profileImageConfig.source}.png`, baseUrl);
        } else if (profileImageConfig.type === 'local') {
          profileImageData = await loadProfileImage(profileImageConfig.source, baseUrl);
        }
        if (!profileImageData && profileImageConfig.fallbacks) {
          for (const fallback of profileImageConfig.fallbacks) {
            const url = fallback.type === 'github'
              ? `https://github.com/${fallback.source}.png`
              : fallback.source;
            profileImageData = await loadProfileImage(url, baseUrl);
            if (profileImageData) break;
          }
        }
      } else if (typeof profileImageConfig === 'string') {
        profileImageData = await loadProfileImage(profileImageConfig, baseUrl);
      }
    }

    const useProfileLayout = isHomepage && !!profileImageData;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: useProfileLayout ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: useProfileLayout ? "60px" : "20px",
              width: "90%",
              height: "90%",
              border: "3px solid #FFD700",
              borderRadius: "20px",
              padding: "60px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {profileImageData && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    border: "4px solid #FFD700",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#333",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/jpeg;base64,${uint8ArrayToBase64(profileImageData)}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    alt="Profile"
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: useProfileLayout ? "flex-start" : "center",
                justifyContent: "center",
                flex: 1,
                textAlign: useProfileLayout ? "left" : "center",
              }}
            >
              <h1
                style={{
                  fontSize: useProfileLayout ? "64px" : "72px",
                  fontWeight: "900",
                  color: "#FFD700",
                  margin: "0 0 16px 0",
                  lineHeight: 1.1,
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  fontSize: useProfileLayout ? "32px" : "36px",
                  color: "#FFFFFF",
                  margin: "0 0 24px 0",
                  opacity: 0.9,
                  lineHeight: 1.3,
                  fontWeight: "400",
                }}
              >
                {subtitle}
              </p>

              {isHomepage && (
                <p
                  style={{
                    fontSize: "20px",
                    color: "rgba(255, 255, 255, 0.6)",
                    margin: "24px 0 0 0",
                    fontFamily: "monospace",
                  }}
                >
                  {config.site.url.replace('https://', '')}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              position: "absolute", top: "20px", right: "20px",
              width: "60px", height: "60px", borderRadius: "50%",
              background: "linear-gradient(45deg, #FFD700, #FFA500)", opacity: 0.2,
            }}
          />
          <div
            style={{
              position: "absolute", bottom: "20px", left: "20px",
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(45deg, #FFD700, #FFA500)", opacity: 0.15,
            }}
          />
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%", width: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            backgroundColor: "#121212", color: "#FFD700",
          }}
        >
          <h1 style={{ fontSize: "60px", fontWeight: "bold" }}>
            Professional Portfolio
          </h1>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}

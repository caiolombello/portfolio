import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros dinâmicos
    const title = searchParams.get("title") || "Caio Barbieri";
    const subtitle =
      searchParams.get("subtitle") ||
      "DevOps Engineer | Cloud Native | Kubernetes";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#121212",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #FFD700",
              borderRadius: "15px",
              padding: "40px",
              margin: "40px",
              width: "80%",
              maxWidth: "1000px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <h1
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#FFD700",
                textAlign: "center",
                margin: "0 0 20px 0",
              }}
            >
              {title}
            </h1>
            <h2
              style={{
                fontSize: "30px",
                color: "#FFFFFF",
                textAlign: "center",
                margin: "0",
                opacity: 0.9,
              }}
            >
              {subtitle}
            </h2>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}

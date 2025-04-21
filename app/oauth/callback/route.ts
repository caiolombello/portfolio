import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      throw new Error("No code provided");
    }

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
          client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
          code,
        }),
      }
    );

    const data = await tokenResponse.json();

    if (data.error) {
      throw new Error(data.error_description || "Failed to get access token");
    }

    // Redirect to the admin page with the token
    const redirectUrl = new URL("/admin/", process.env.NEXT_PUBLIC_APP_URL);
    redirectUrl.hash = `#/callback?provider=github&token=${data.access_token}&expires_in=3600`;

    return NextResponse.redirect(redirectUrl.toString(), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
} 
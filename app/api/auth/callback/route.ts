import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const provider = searchParams.get("provider");

  if (!code || provider !== "github") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      throw new Error(data.error_description || "Failed to get access token");
    }

    // Redirect back to the CMS with the token
    const redirectUrl = new URL("/admin/", process.env.NEXT_PUBLIC_APP_URL);
    redirectUrl.hash = `#/callback?provider=github&token=${data.access_token}`;
    
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
} 
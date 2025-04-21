import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/oauth/callback`;
  const scope = "repo,user";

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("response_type", "code");

  return NextResponse.redirect(url.toString());
} 
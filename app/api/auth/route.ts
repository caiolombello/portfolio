import { NextRequest, NextResponse } from "next/server";

// Variáveis de ambiente (configure no painel da Vercel)
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback";
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_URL = "https://api.github.com/user";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  if (!CLIENT_ID) {
    console.error('GitHub OAuth environment variables not set.');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  const callbackUrl = new URL('/api/callback', APP_URL).toString();
  const scopes = ['repo', 'user'];

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('state', 'github-oauth-state');

  console.log(`Redirecting to GitHub auth: ${authUrl.toString()}`);

  return NextResponse.redirect(authUrl.toString());
}

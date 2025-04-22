import { NextRequest, NextResponse } from "next/server";

// Variáveis de ambiente (configure no painel da Vercel)
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback";
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_URL = "https://api.github.com/user";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  console.log('Starting GitHub OAuth flow...');
  console.log('Environment:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    appUrl: APP_URL
  });

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('GitHub OAuth environment variables not set.');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  // Ensure we request all necessary scopes for repo access
  const scopes = ['repo', 'user', 'read:org', 'workflow'];
  const callbackUrl = `${APP_URL}/api/callback`;

  console.log('OAuth Configuration:', {
    scopes,
    callbackUrl
  });

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('state', 'github-oauth-state');

  console.log(`Redirecting to GitHub auth: ${authUrl.toString()}`);

  return NextResponse.redirect(authUrl.toString());
}

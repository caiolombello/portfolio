import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    console.error('Callback missing code');
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.error('GitHub OAuth environment variables not set for callback.');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error(`GitHub token exchange failed: ${tokenResponse.status}`, errorBody);
      throw new Error(`GitHub token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('GitHub token exchange error:', tokenData.error_description || 'No access token received');
      throw new Error(tokenData.error_description || 'No access token received from GitHub');
    }

    const accessToken = tokenData.access_token;
    const tokenType = tokenData.token_type || 'bearer';

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authorizing...</title>
      </head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("received message", e);
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({
                  token: "${accessToken}",
                  provider: "github"
                })}',
                "*"
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            console.log("sending message: authorizing:github");
            window.opener.postMessage("authorizing:github", "*");
          })()
        </script>
      </body>
      </html>
    `;

    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error: any) {
    console.error('Error in GitHub OAuth callback:', error);
    return NextResponse.json({ error: 'Authentication failed', details: error.message }, { status: 500 });
  }
} 
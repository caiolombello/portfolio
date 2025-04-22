import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  console.log('Callback received. Processing OAuth response...');
  
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  
  console.log('OAuth Response:', {
    hasCode: !!code,
    state,
    url: request.url
  });

  if (!code) {
    console.error('Callback missing code');
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.error('GitHub OAuth environment variables not set for callback.');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    console.log('Exchanging code for access token...');
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
    console.log('Token exchange response:', {
      success: !!tokenData.access_token,
      error: tokenData.error,
      errorDescription: tokenData.error_description
    });

    if (tokenData.error || !tokenData.access_token) {
      console.error('GitHub token exchange error:', tokenData.error_description || 'No access token received');
      throw new Error(tokenData.error_description || 'No access token received from GitHub');
    }

    // Test the token by making a request to the GitHub API
    const testResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    if (!testResponse.ok) {
      console.error('Token validation failed:', await testResponse.text());
      throw new Error('Token validation failed');
    }

    const userData = await testResponse.json();
    console.log('Successfully authenticated as GitHub user:', userData.login);

    const accessToken = tokenData.access_token;
    const tokenType = tokenData.token_type || 'bearer';

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authorizing...</title>
        <script>
          console.log('Callback page loaded, preparing to send token...');
        </script>
      </head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("Received message from CMS:", e);
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
            console.log("Sending initial message to CMS...");
            window.opener.postMessage("authorizing:github", "*");
          })()
        </script>
        <h1>Authorizing with GitHub...</h1>
        <p>This window should close automatically. If it doesn't, you can close it.</p>
      </body>
      </html>
    `;

    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error: any) {
    console.error('Error in GitHub OAuth callback:', error);
    const errorContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authentication Error</title>
      </head>
      <body>
        <h1>Authentication Error</h1>
        <p>Failed to authenticate with GitHub: ${error.message}</p>
        <p>Please close this window and try again.</p>
        <script>
          console.error('Authentication error:', ${JSON.stringify(error.message)});
        </script>
      </body>
      </html>
    `;
    return new NextResponse(errorContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
} 
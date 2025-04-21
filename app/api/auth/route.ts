import { NextRequest, NextResponse } from "next/server";

// Variáveis de ambiente (configure no painel da Vercel)
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback";
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_URL = "https://api.github.com/user";

export async function GET(req: NextRequest) {
  const { searchParams, pathname } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // 1. Início do fluxo: redirecionar para o GitHub OAuth
  if (!code) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo&state=decap`;
    return NextResponse.redirect(githubAuthUrl);
  }

  // 2. Callback: trocar code por access_token
  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      state,
    }),
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.json({ error: "No access token" }, { status: 400 });
  }

  // 3. Opcional: buscar dados do usuário (pode ser útil para logs)
  // const userRes = await fetch(USER_URL, {
  //   headers: { Authorization: `token ${tokenData.access_token}` },
  // })
  // const user = await userRes.json()

  // 4. Redirecionar de volta para o Decap CMS com o token
  // O Decap CMS espera receber o token como parte do hash na URL
  const cmsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/index.html#access_token=${tokenData.access_token}&token_type=bearer`;
  return NextResponse.redirect(cmsUrl);
}

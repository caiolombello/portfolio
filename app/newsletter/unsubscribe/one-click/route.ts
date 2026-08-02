import {
  buildNewsletterApiEndpoint,
  getNewsletterApiUrl,
} from "@/lib/newsletter";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,256}$/;

function plainResponse(status: number): Response {
  return new Response(null, {
    status,
    headers: {
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || !TOKEN_PATTERN.test(token)) return plainResponse(400);

  try {
    const response = await fetch(
      buildNewsletterApiEndpoint(
        getNewsletterApiUrl(),
        "/subscriptions/unsubscribe",
      ),
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ token }),
        cache: "no-store",
      },
    );
    return plainResponse(response.ok ? 204 : response.status);
  } catch {
    return plainResponse(503);
  }
}

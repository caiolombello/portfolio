import { NextRequest } from "next/server";
import { getPreviewContent, enablePreviewMode } from "@/lib/cms/preview";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collection = searchParams.get("collection");
  const slug = searchParams.get("slug");

  if (!collection || !slug) {
    return new Response("Missing collection or slug", { status: 400 });
  }

  const previewData = await getPreviewContent(collection, slug);

  if (!previewData) {
    return new Response("Preview not found", { status: 404 });
  }

  // Enable preview mode
  enablePreviewMode(collection, slug);

  // Redirect to the content page
  const redirectUrl = `/${collection}/${slug}`;
  return Response.redirect(new URL(redirectUrl, request.url));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collection, slug, data } = body;

    if (!collection || !slug || !data) {
      return new Response("Missing required fields", { status: 400 });
    }

    // In a real implementation, this would save to your Git provider's API
    // For now, we'll simulate it with localStorage in the browser
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `preview_${collection}_${slug}`,
        JSON.stringify(data),
      );
    }

    return new Response("Preview data saved", { status: 200 });
  } catch (error) {
    console.error("Error saving preview data:", error);
    return new Response("Error saving preview data", { status: 500 });
  }
}

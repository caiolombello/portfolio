import { validateContent } from "./validation";
import { cookies } from "next/headers";

interface PreviewData {
  collection: string;
  slug: string;
  data: unknown;
}

export async function getPreviewContent(collection: string, slug: string) {
  try {
    // In a real implementation, this would fetch from your Git provider's API
    // For now, we'll simulate it with localStorage in the browser
    const previewData =
      typeof window !== "undefined"
        ? localStorage.getItem(`preview_${collection}_${slug}`)
        : null;

    if (!previewData) {
      return null;
    }

    const data = JSON.parse(previewData);
    return await validateContent(collection, data);
  } catch (error) {
    console.error("Error fetching preview content:", error);
    return null;
  }
}

export async function enablePreviewMode(collection: string, slug: string) {
  const cookieStore = await cookies();
  cookieStore.set("preview-mode", "true", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  cookieStore.set("preview-collection", collection, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  cookieStore.set("preview-slug", slug, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

export async function disablePreviewMode() {
  const cookieStore = await cookies();
  cookieStore.delete("preview-mode");
  cookieStore.delete("preview-collection");
  cookieStore.delete("preview-slug");
}

export async function getPreviewData() {
  const cookieStore = await cookies();
  const isPreview = cookieStore.get("preview-mode")?.value === "true";
  const collection = cookieStore.get("preview-collection")?.value;
  const slug = cookieStore.get("preview-slug")?.value;

  return {
    isPreview,
    collection,
    slug,
  };
}

export async function isPreviewMode(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("preview-mode")?.value === "true";
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify webhook secret if configured
    const secret = request.headers.get("x-webhook-secret");
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 401 },
      );
    }

    // Extract information about what changed
    const { collection, slug } = body;

    // Revalidate appropriate paths based on the content type
    switch (collection) {
      case "profile":
        revalidatePath("/");
        revalidatePath("/about");
        break;
      case "projects":
        revalidatePath("/projects");
        revalidatePath(`/projects/${slug}`);
        break;
      case "posts":
        revalidatePath("/blog");
        revalidatePath(`/blog/${slug}`);
        break;
      case "experience":
      case "education":
      case "certifications":
        revalidatePath("/resume");
        break;
      default:
        // Revalidate all pages if we're unsure what changed
        revalidatePath("/");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 },
    );
  }
}

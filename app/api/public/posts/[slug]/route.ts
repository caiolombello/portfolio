import { NextResponse } from "next/server";
import { loadPostBySlug } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await loadPostBySlug(slug);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error loading post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
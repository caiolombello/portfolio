import { NextResponse } from "next/server";
import { loadPosts } from "@/lib/data";

export async function GET() {
  try {
    const posts = await loadPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error loading posts:", error);
    return NextResponse.json({ posts: [] });
  }
}

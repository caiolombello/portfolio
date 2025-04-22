import { NextResponse } from "next/server";
import { loadPosts } from "@/lib/server/files";

export async function GET() {
  try {
    const posts = loadPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error loading posts:", error);
    return NextResponse.json({ posts: [] });
  }
}

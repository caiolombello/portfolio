import { NextResponse } from "next/server";
import { getPostsData } from "@/lib/data";

export async function GET() {
  try {
    const posts = await getPostsData();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error loading posts:", error);
    return NextResponse.json({ posts: [] });
  }
}

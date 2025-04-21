import { NextResponse } from "next/server";
import { loadPosts } from "@/lib/data";

export async function GET() {
  try {
    const data = await loadPosts();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading posts:", error);
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 },
    );
  }
}

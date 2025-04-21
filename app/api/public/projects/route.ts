import { NextResponse } from "next/server";
import { loadProjects } from "@/lib/data";

export async function GET() {
  try {
    const data = await loadProjects();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading projects:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 },
    );
  }
}

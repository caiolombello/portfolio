import { NextResponse } from "next/server";
import { loadProjects } from "@/lib/data";

export async function GET() {
  try {
    const projects = await loadProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error loading projects:", error);
    return NextResponse.json({ projects: [] });
  }
}

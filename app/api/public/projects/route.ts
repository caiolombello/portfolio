import { NextResponse } from "next/server";
import { loadProjects } from "@/lib/server/files";

export async function GET() {
  try {
    const projects = loadProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error loading projects:", error);
    return NextResponse.json({ projects: [] });
  }
}

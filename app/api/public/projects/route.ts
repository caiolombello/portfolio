import { NextResponse } from "next/server";
import { getProjectsData } from "@/lib/data";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";

export async function GET() {
  try {
    if (!isPortfolioEnabled(getSiteConfig())) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await getProjectsData();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error loading projects:", error);
    return NextResponse.json({ projects: [] });
  }
}

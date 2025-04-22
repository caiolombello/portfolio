import { NextResponse } from "next/server";
import { loadSkills } from "@/lib/server/files";

export async function GET() {
  try {
    const skills = loadSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error loading skills:", error);
    return NextResponse.json({ skills_list: [] });
  }
}

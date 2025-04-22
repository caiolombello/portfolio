import { NextResponse } from "next/server";
import { loadSkills } from "@/lib/utils";

export async function GET() {
  try {
    const skills = loadSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error loading skills:", error);
    return NextResponse.json(
      { error: "Failed to load skills" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { loadSkills } from "@/lib/data";

export async function GET() {
  try {
    const data = await loadSkills();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading skills:", error);
    return NextResponse.json(
      { error: "Failed to load skills" },
      { status: 500 },
    );
  }
}

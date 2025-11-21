import { NextResponse } from "next/server";
import { getSkillsData } from "@/lib/data";

export async function GET() {
  const skills = await getSkillsData();
  return NextResponse.json(skills);
}

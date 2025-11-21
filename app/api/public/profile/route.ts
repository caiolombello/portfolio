import { NextResponse } from "next/server";
import { getProfileData } from "@/lib/data";

export async function GET() {
  const data = await getProfileData();
  if (!data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

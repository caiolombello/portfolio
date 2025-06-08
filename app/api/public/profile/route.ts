import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "content/profile/profile.json");
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

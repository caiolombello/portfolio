import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { status: "healthy" },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

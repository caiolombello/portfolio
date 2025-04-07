import { NextResponse } from "next/server"
import { getBlob } from "@/lib/blob-storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format")
  const size = searchParams.get("size")

  try {
    const favicon = await getBlob("favicon.png")
    if (!favicon) {
      return new NextResponse("Favicon not found", { status: 404 })
    }

    const buffer = Buffer.from(favicon, "base64")
    const headers = new Headers()
    
    if (format === "ico") {
      headers.set("Content-Type", "image/x-icon")
    } else {
      headers.set("Content-Type", "image/png")
    }

    return new NextResponse(buffer, { headers })
  } catch (error) {
    console.error("Error serving favicon:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


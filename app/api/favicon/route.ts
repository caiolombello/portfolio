import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format")
  const size = searchParams.get("size")

  try {
    // Servir apenas o favicon local
    const faviconPath = path.join(process.cwd(), "public", "favicon-32x32.png")
    const favicon = await fs.readFile(faviconPath)
    const headers = new Headers()
    if (format === "ico") {
      headers.set("Content-Type", "image/x-icon")
    } else {
      headers.set("Content-Type", "image/png")
    }
    return new NextResponse(favicon, { headers })
  } catch (error) {
    console.error("Error serving favicon:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


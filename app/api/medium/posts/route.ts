import { NextResponse } from "next/server"
import { parseString } from "xml2js"
import { generateSlug } from "@/lib/utils"

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME
const MEDIUM_RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`

export async function GET() {
  try {
    const response = await fetch(MEDIUM_RSS_URL)
    const xml = await response.text()
    
    const posts = await parseMediumRSS(xml)
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching Medium posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch Medium posts" },
      { status: 500 }
    )
  }
}

async function parseMediumRSS(xml: string) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      try {
        const items = result.rss.channel[0].item
        const posts = items.map((item: any) => {
          // Extrair o conteúdo HTML do post
          const content = item["content:encoded"]?.[0] || ""
          
          // Extrair a imagem de capa do conteúdo
          const coverImageMatch = content.match(/<img[^>]+src="([^">]+)"/)
          const coverImage = coverImageMatch ? coverImageMatch[1] : null
          
          // Extrair o excerto
          const excerpt = item.description?.[0] || ""
          
          // Extrair as tags
          const categories = item.category || []
          const tags = categories.map((cat: any) => cat._)
          
          return {
            id: item.guid[0]._,
            title: item.title[0],
            slug: generateSlug(item.title[0]),
            excerpt,
            content,
            coverImage,
            date: item.pubDate[0],
            author: {
              name: item["dc:creator"]?.[0] || "Unknown",
            },
            tags,
            published: true,
            createdAt: item.pubDate[0],
            updatedAt: item.pubDate[0],
          }
        })

        resolve(posts)
      } catch (error) {
        reject(error)
      }
    })
  })
} 
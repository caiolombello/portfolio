import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getBlob } from "@/lib/blob-storage"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const posts = await getBlob("posts.json")
    if (!posts) {
      return NextResponse.json(
        { error: "Posts não encontrados" },
        { status: 404 }
      )
    }

    const postsData = JSON.parse(posts)
    const post = postsData.find((p: any) => p.id === params.id)

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Erro ao carregar post:", error)
    return NextResponse.json(
      { error: "Erro ao carregar post" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await request.json()

    // Validate post
    if (!post.title || !post.slug || !post.content) {
      return NextResponse.json(
        { error: "Post inválido" },
        { status: 400 }
      )
    }

    // Load current posts
    const posts = await getBlob("posts.json")
    let postsData = []
    if (posts) {
      postsData = JSON.parse(posts)
    }

    // Update or add post
    const index = postsData.findIndex((p: any) => p.id === params.id)
    if (index >= 0) {
      postsData[index] = {
        ...postsData[index],
        ...post,
        updatedAt: new Date().toISOString(),
      }
    } else {
      postsData.push({
        ...post,
        id: params.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    // Save posts
    await put("posts.json", JSON.stringify(postsData), {
      access: "public",
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Erro ao salvar post:", error)
    return NextResponse.json(
      { error: "Erro ao salvar post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Load current posts
    const posts = await getBlob("posts.json")
    if (!posts) {
      return NextResponse.json(
        { error: "Posts não encontrados" },
        { status: 404 }
      )
    }

    const postsData = JSON.parse(posts)
    const filteredPosts = postsData.filter((p: any) => p.id !== params.id)

    // Save posts
    await put("posts.json", JSON.stringify(filteredPosts), {
      access: "public",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar post:", error)
    return NextResponse.json(
      { error: "Erro ao deletar post" },
      { status: 500 }
    )
  }
} 
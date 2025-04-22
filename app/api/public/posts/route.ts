import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ensureDirectoryExists } from "@/lib/utils";

export async function GET() {
  try {
    const postsDir = path.join(process.cwd(), "content/posts");
    ensureDirectoryExists(postsDir);

    if (!fs.existsSync(postsDir)) {
      // Return empty array if directory doesn't exist
      return NextResponse.json({ posts: [] });
    }

    const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));
    
    const posts = postFiles.map(filename => {
      const filePath = path.join(postsDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      
      return {
        slug: filename.replace(".md", ""),
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "Anonymous",
        tags: data.tags || [],
      };
    });

    // Sort posts by date in descending order
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error loading posts:", error);
    // Return empty array instead of error
    return NextResponse.json({ posts: [] });
  }
}

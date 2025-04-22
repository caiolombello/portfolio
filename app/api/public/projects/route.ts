import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ensureDirectoryExists } from "@/lib/utils";

export async function GET() {
  try {
    const projectsDir = path.join(process.cwd(), "content/projects");
    ensureDirectoryExists(projectsDir);

    if (!fs.existsSync(projectsDir)) {
      // Return empty array if directory doesn't exist
      return NextResponse.json({ projects: [] });
    }

    const projectFiles = fs.readdirSync(projectsDir).filter(file => file.endsWith(".json"));
    
    const projects = projectFiles.map(filename => {
      const filePath = path.join(projectsDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContents);
      
      return {
        id: data.id || filename.replace(".json", ""),
        title: data.title || "Untitled Project",
        description: data.description || "",
        image: data.image || null,
        technologies: data.technologies || [],
        github: data.github || null,
        url: data.url || null,
        featured: data.featured || false,
      };
    });

    // Sort featured projects first
    projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error loading projects:", error);
    // Return empty array instead of error
    return NextResponse.json({ projects: [] });
  }
}

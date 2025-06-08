import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function loadPosts() {
  try {
    const postsDir = path.join(process.cwd(), "content/posts");
    ensureDirectoryExists(postsDir);

    if (!fs.existsSync(postsDir)) {
      return [];
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

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

export function loadProjects() {
  try {
    const projectsDir = path.join(process.cwd(), "content/projects");
    ensureDirectoryExists(projectsDir);

    if (!fs.existsSync(projectsDir)) {
      return [];
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

    return projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export function loadSkills() {
  try {
    const skillsDir = path.join(process.cwd(), "content/skills");
    ensureDirectoryExists(skillsDir);
    
    const skillsPath = path.join(skillsDir, "skills.json");
    if (!fs.existsSync(skillsPath)) {
      const defaultSkills = {
        skills_list: [
          {
            name: "TypeScript",
            category: "Linguagens",
            level: "Experiente"
          },
          {
            name: "React",
            category: "Frontend",
            level: "Experiente"
          }
        ]
      };
      fs.writeFileSync(skillsPath, JSON.stringify(defaultSkills, null, 2));
      return defaultSkills;
    }

    const skillsData = fs.readFileSync(skillsPath, "utf-8");
    return JSON.parse(skillsData);
  } catch (error) {
    console.error("Error loading skills:", error);
    return { skills_list: [] };
  }
} 
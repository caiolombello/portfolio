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

    const files = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));
    const postsMap = new Map<string, any>();

    files.forEach(filename => {
      const filePath = path.join(postsDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      // Extract base slug and language
      // Format: name.lang.md (e.g., hello-world.en.md)
      const parts = filename.split('.');
      const lang = parts.length > 2 ? parts[parts.length - 2] : 'en'; // default to en if no lang
      const baseSlug = filename.replace(`.${lang}.md`, "").replace(".md", "");

      if (!postsMap.has(baseSlug)) {
        postsMap.set(baseSlug, {
          slug_en: `${baseSlug}.en`,
          slug_pt: `${baseSlug}.pt`,
          title_en: "",
          title_pt: "",
          summary_en: "",
          summary_pt: "",
          body_en: "",
          body_pt: "",
          date: "",
          author: "Anonymous",
          tags: [],
          coverImage: null,
        });
      }

      const post = postsMap.get(baseSlug);

      // Common metadata (take from the first file encountered or prefer one language?)
      // Usually date, author, tags, coverImage are shared or similar.
      // We'll update them from the current file, so the last one processed wins for shared fields.
      if (data.publicationDate || data.date) post.date = data.publicationDate || data.date;
      if (data.author) post.author = data.author;
      if (data.tags) post.tags = data.tags;
      if (data.coverImage) post.coverImage = data.coverImage;

      // Language specific fields
      if (lang === 'pt') {
        post.title_pt = data.title;
        post.summary_pt = data.summary || data.description || "";
        post.body_pt = content;
        post.slug_pt = `${baseSlug}.pt`; // Ensure explicit slug
        post.tags_pt = data.tags || [];
      } else {
        post.title_en = data.title;
        post.summary_en = data.summary || data.description || "";
        post.body_en = content;
        post.slug_en = `${baseSlug}.en`; // Ensure explicit slug
        post.tags_en = data.tags || [];
      }
    });

    const posts = Array.from(postsMap.values()).map(post => ({
      ...post,
      // Ensure fallbacks if one language is missing
      title_en: post.title_en || post.title_pt,
      title_pt: post.title_pt || post.title_en,
      summary_en: post.summary_en || post.summary_pt,
      summary_pt: post.summary_pt || post.summary_en,
      body_en: post.body_en || post.body_pt,
      body_pt: post.body_pt || post.body_en,
      tags_en: post.tags_en || post.tags_pt || [],
      tags_pt: post.tags_pt || post.tags_en || [],
      publicationDate: post.date, // Map date to publicationDate to match type
    }));

    return posts.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
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
        title_pt: data.title_pt || data.title || "Untitled Project",
        title_en: data.title_en || data.title || "Untitled Project",
        shortDescription_pt: data.shortDescription_pt || "",
        shortDescription_en: data.shortDescription_en || "",
        description_pt: data.description_pt || data.description || "",
        description_en: data.description_en || data.description || "",
        imageUrl: data.imageUrl || data.image || null,
        category: data.category,
        technologies: data.technologies || [],
        githubUrl: data.githubUrl || data.github || null,
        liveUrl: data.liveUrl || data.url || null,
        featured: data.featured || false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
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

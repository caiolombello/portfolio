import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import type { Post } from "@/types/blog";
import { parseBlogDate } from "@/lib/blog-date";

const postFrontmatterSchema = z
  .object({
    author: z.string().trim().min(1),
    category: z.string().trim().min(1),
    coverImage: z.string().trim().min(1).optional(),
    date: z.string().optional(),
    description: z.string().trim().min(1),
    publicationDate: z.string().optional(),
    published: z.boolean().default(true),
    tags: z.array(z.string().trim().min(1)).default([]),
    title: z.string().trim().min(1),
    updatedAt: z.string().optional(),
  })
  .refine((data) => Boolean(data.date || data.publicationDate), {
    message: "date is required",
  });

interface PostDraft extends Omit<Post, "publicationDate"> {
  date: string;
}

export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function loadPosts() {
  const postsDir = path.join(process.cwd(), "content/posts");
  return loadPostsFromDirectory(postsDir);
}

export function loadPostsFromDirectory(postsDir: string) {
  try {
    if (!fs.existsSync(postsDir)) {
      throw new Error(`Posts directory is missing: ${postsDir}`);
    }

    const files = fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith(".md"))
      .sort();
    const postsMap = new Map<string, PostDraft>();
    const publicationStateMap = new Map<string, boolean>();

    files.forEach(filename => {
      const filePath = path.join(postsDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      const filenameMatch = /^(.+)\.(en|pt)\.md$/.exec(filename);
      if (!filenameMatch) {
        throw new Error(`Invalid post filename: ${filename}`);
      }

      const [, baseSlug, lang] = filenameMatch;
      const parsedFrontmatter = postFrontmatterSchema.safeParse(data);
      if (!parsedFrontmatter.success) {
        throw new Error(
          `Post "${baseSlug}" has invalid frontmatter: ${parsedFrontmatter.error.issues.map((issue) => issue.message).join(", ")}`,
        );
      }
      const metadata = parsedFrontmatter.data;

      if (
        publicationStateMap.has(baseSlug) &&
        publicationStateMap.get(baseSlug) !== metadata.published
      ) {
        throw new Error(
          `Post "${baseSlug}" has inconsistent publication state`,
        );
      }
      publicationStateMap.set(baseSlug, metadata.published);

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
          published: true,
          tags: [],
          coverImage: undefined,
        });
      }

      const post = postsMap.get(baseSlug);
      if (!post) return;

      // Common metadata (take from the first file encountered or prefer one language?)
      // Usually date, author, tags, coverImage are shared or similar.
      // We'll update them from the current file, so the last one processed wins for shared fields.
      if (metadata.publicationDate || metadata.date) {
        const publicationDate = metadata.publicationDate || metadata.date;
        if (!publicationDate) return;
        parseBlogDate(publicationDate);
        if (post.date && post.date !== publicationDate) {
          throw new Error(
            `Post "${baseSlug}" has inconsistent publication metadata`,
          );
        }
        post.date = publicationDate;
      }
      post.author = metadata.author;
      post.tags = metadata.tags;
      if (metadata.coverImage) post.coverImage = metadata.coverImage;
      post.published = metadata.published;
      if (metadata.updatedAt) {
        parseBlogDate(metadata.updatedAt);
        post.updatedAt = metadata.updatedAt;
      }

      // Language specific fields
      if (lang === 'pt') {
        post.title_pt = metadata.title;
        post.summary_pt = metadata.description;
        post.body_pt = content;
        post.slug_pt = `${baseSlug}.pt`; // Ensure explicit slug
        post.tags_pt = metadata.tags;
        post.category_pt = metadata.category;
      } else {
        post.title_en = metadata.title;
        post.summary_en = metadata.description;
        post.body_en = content;
        post.slug_en = `${baseSlug}.en`; // Ensure explicit slug
        post.tags_en = metadata.tags;
        post.category_en = metadata.category;
      }
    });

    const posts = Array.from(postsMap.entries())
      .filter(([, post]) => post.published !== false)
      .map(([baseSlug, post]) => {
        if (!post.title_en || !post.title_pt || !post.body_en || !post.body_pt) {
          throw new Error(`Post "${baseSlug}" is missing a translation`);
        }

        return {
          ...post,
          tags_en: post.tags_en || [],
          tags_pt: post.tags_pt || [],
          publicationDate: post.date,
        };
      });

    return posts
      .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
  } catch (error) {
    console.error("Error loading posts:", error);
    throw error;
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
        caseStudy: data.caseStudy,
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

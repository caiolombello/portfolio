import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ProfileSchema,
  SkillsDataSchema,
  ExperienceSchema,
  EducationSchema,
  CertificationSchema,
  ProjectSchema,
  PostSchema,
} from "./validation";
import type {
  Profile,
  SkillsData,
  Experience,
  Education,
  Certification,
  Project,
  Post,
} from "@/types";
import {
  handleFsError,
  handleJsonError,
  handleValidationError,
  DirectoryNotFoundError,
} from "./errors";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache for frequently accessed data
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Helper function to read and parse JSON files with error handling
 * @param filePath Path to the JSON file
 * @returns Parsed JSON data
 * @throws {FileNotFoundError} If the file doesn't exist
 * @throws {FileReadError} If there's an error reading the file
 * @throws {JsonParseError} If the JSON is invalid
 */
async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      handleFsError(error, filePath);
    }
    if (error instanceof SyntaxError) {
      handleJsonError(error, filePath);
    }
    throw error;
  }
}

/**
 * Helper function to read and parse Markdown files with error handling
 * @param filePath Path to the Markdown file
 * @returns File contents as string
 * @throws {FileNotFoundError} If the file doesn't exist
 * @throws {FileReadError} If there's an error reading the file
 */
async function readMarkdownFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    handleFsError(error, filePath);
  }
}

/**
 * Helper function to read directory contents with error handling
 * @param dirPath Path to the directory
 * @returns Array of file names
 * @throws {DirectoryNotFoundError} If the directory doesn't exist
 * @throws {FileReadError} If there's an error reading the directory
 */
async function readDirectory(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    return files.filter(
      (file) => file.endsWith(".json") || file.endsWith(".md"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new DirectoryNotFoundError(dirPath);
    }
    handleFsError(error, dirPath);
  }
}

/**
 * Helper function to get or set cached data
 * @param key Cache key
 * @param fetchFn Function to fetch data if not cached
 * @returns Cached or freshly fetched data
 */
async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: now });
  return data;
}

/**
 * Load profile data with caching
 * @returns Profile data
 * @throws Error if profile data can't be loaded or is invalid
 */
export async function loadProfile(): Promise<Profile> {
  return getCachedData("profile", async () => {
    const filePath = path.join(CONTENT_DIR, "settings", "profile.json");
    const data = await readJsonFile<Profile>(filePath);
    return ProfileSchema.parse(data);
  });
}

/**
 * Load skills data with caching
 * @returns Skills data
 * @throws Error if skills data can't be loaded or is invalid
 */
export async function loadSkills(): Promise<SkillsData> {
  return getCachedData("skills", async () => {
    const filePath = path.join(CONTENT_DIR, "data", "skills.json");
    const data = await readJsonFile<SkillsData>(filePath);
    return SkillsDataSchema.parse(data);
  });
}

/**
 * Load experiences with caching
 * @returns Array of experiences sorted by start date
 * @throws Error if experiences can't be loaded or are invalid
 */
export async function loadExperiences(): Promise<Experience[]> {
  return getCachedData("experiences", async () => {
    const dirPath = path.join(CONTENT_DIR, "experience");
    const files = await readDirectory(dirPath);
    const experiences = await Promise.all(
      files.map(async (file: string) => {
        const data = await readJsonFile<Experience>(path.join(dirPath, file));
        return ExperienceSchema.parse(data);
      }),
    );

    return experiences.sort((a: Experience, b: Experience) => {
      const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
      const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  });
}

/**
 * Load education data with caching
 * @returns Array of education entries sorted by end date
 * @throws Error if education data can't be loaded or is invalid
 */
export async function loadEducation(): Promise<Education[]> {
  return getCachedData("education", async () => {
    const dirPath = path.join(CONTENT_DIR, "education");
    const files = await readDirectory(dirPath);
    const education = await Promise.all(
      files.map(async (file: string) => {
        const data = await readJsonFile<Education>(path.join(dirPath, file));
        return EducationSchema.parse(data);
      }),
    );

    return education.sort((a: Education, b: Education) => {
      const dateA = a.endDate ? new Date(a.endDate) : new Date(0);
      const dateB = b.endDate ? new Date(b.endDate) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  });
}

/**
 * Load certifications with caching
 * @returns Array of certifications sorted by date
 * @throws Error if certifications can't be loaded or are invalid
 */
export async function loadCertifications(): Promise<Certification[]> {
  return getCachedData("certifications", async () => {
    const dirPath = path.join(CONTENT_DIR, "certifications");
    const files = await readDirectory(dirPath);
    const certifications = await Promise.all(
      files.map(async (file: string) => {
        const data = await readJsonFile<Certification>(
          path.join(dirPath, file),
        );
        return CertificationSchema.parse(data);
      }),
    );

    return certifications.sort((a: Certification, b: Certification) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  });
}

/**
 * Load projects with caching
 * @returns Array of projects sorted by creation date
 * @throws Error if projects can't be loaded or are invalid
 */
export async function loadProjects(): Promise<Project[]> {
  return getCachedData("projects", async () => {
    const dirPath = path.join(CONTENT_DIR, "projects");
    const files = await readDirectory(dirPath);
    const projects = await Promise.all(
      files.map(async (file: string) => {
        const data = await readJsonFile<Project>(path.join(dirPath, file));
        return ProjectSchema.parse(data);
      }),
    );

    return projects.sort((a: Project, b: Project) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  });
}

/**
 * Utility function to generate a URL-friendly slug from a title
 * @param title The title to convert to a slug
 * @returns A URL-friendly slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .trim();
}

/**
 * Load blog posts with caching
 * @returns Array of published posts sorted by publication date
 * @throws Error if posts can't be loaded or are invalid
 */
export async function loadPosts(): Promise<Post[]> {
  return getCachedData("posts", async () => {
    const dirPath = path.join(CONTENT_DIR, "posts");
    const files = await readDirectory(dirPath);

    const postGroups: { [key: string]: string[] } = {};
    for (const file of files) {
      const baseName = file.replace(/\.(pt|en|es)\.md$/, "").replace(/\.json$/, "");
      if (!postGroups[baseName]) {
        postGroups[baseName] = [];
      }
      postGroups[baseName].push(file);
    }

    const postsPromises = Object.values(postGroups).map(async (groupFiles) => {
      const jsonFile = groupFiles.find((f) => f.endsWith(".json"));
      if (!jsonFile) return null;

      const jsonPath = path.join(dirPath, jsonFile);
      try {
        const sharedData = await readJsonFile<any>(jsonPath);
        const postData: Partial<Post> = { ...sharedData };

        const mdFiles = groupFiles.filter((f) => f.endsWith(".md"));

        for (const file of mdFiles) {
          const langMatch = file.match(/\.(pt|en|es)\.md$/);
          const lang = langMatch ? langMatch[1] : null;

          if (lang) {
            const contentPath = path.join(dirPath, file);
            const contentFile = await readMarkdownFile(contentPath);
            const { data: frontmatter, content } = matter(contentFile);

            (postData as any)[`title_${lang}`] = frontmatter.title;
            (postData as any)[`summary_${lang}`] = frontmatter.summary;
            (postData as any)[`slug_${lang}`] = generateSlug(frontmatter.title || "");
            (postData as any)[`body_${lang}`] = content.trim();
          }
        }

        return PostSchema.parse(postData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          handleValidationError(error, jsonFile);
        } else {
          console.error(`Error processing post group for ${jsonFile}:`, error);
        }
        return null;
      }
    });

    const posts = await Promise.all(postsPromises);

    return posts
      .filter((post): post is Post => post !== null && !!post.published)
      .sort((a, b) => {
        const dateA = new Date(a.publicationDate);
        const dateB = new Date(b.publicationDate);
        return dateB.getTime() - dateA.getTime();
      });
  });
}

/**
 * Load a single project by ID
 * @param id Project ID
 * @returns Project data or null if not found
 * @throws Error if project data is invalid
 */
export async function loadProjectById(id: string): Promise<Project | null> {
  const projects = await loadProjects();
  return projects.find((project) => project.id === id) || null;
}

/**
 * Load a single blog post by slug
 * @param slug Post slug
 * @returns Post data or null if not found
 * @throws Error if post data is invalid
 */
export async function loadPostBySlug(slug: string): Promise<Post | null> {
  const posts = await loadPosts();
  return (
    posts.find((post) => post.slug_pt === slug || post.slug_en === slug) || null
  );
}

// Outras funções de dados permanecem inalteradas...

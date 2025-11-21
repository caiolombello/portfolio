import fs from "fs";
import path from "path";
import { loadSkills } from "@/lib/server/files";
import testimonials from "@/content/testimonials.json";

export async function getProfileData() {
  const filePath = path.join(process.cwd(), "content/profile/profile.json");
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export async function getSkillsData() {
  try {
    return loadSkills();
  } catch (error) {
    console.error("Error loading skills:", error);
    return { skills_list: [] };
  }
}

export async function getTestimonialsData() {
  return testimonials;
}

export async function getExperiencesData() {
  try {
    const experiencesDir = path.join(process.cwd(), "content/experience");
    if (!fs.existsSync(experiencesDir)) {
      return [];
    }

    const files = fs.readdirSync(experiencesDir).filter((file) => file.endsWith(".json"));
    const experiences = files.map((file) => {
      const filePath = path.join(experiencesDir, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContents);
    });

    return experiences.sort((a, b) => {
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading experiences:", error);
    return [];
  }
}

export async function getEducationData() {
  try {
    const educationDir = path.join(process.cwd(), "content/education");
    if (!fs.existsSync(educationDir)) {
      return [];
    }

    const files = fs.readdirSync(educationDir).filter((file) => file.endsWith(".json"));
    const education = files.map((file) => {
      const filePath = path.join(educationDir, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContents);
    });

    return education.sort((a, b) => {
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading education:", error);
    return [];
  }
}

// Re-export functions from lib/server/files.ts for compatibility
export { loadPosts, loadProjects } from "@/lib/server/files";

// Helper wrappers if needed or direct re-exports
import { loadPosts, loadProjects } from "@/lib/server/files";

export async function getProjectsData() {
  return loadProjects();
}

export async function getPostsData(language?: string) {
  return loadPosts();
}

export async function loadPostBySlug(slug: string) {
  const posts = loadPosts();
  return posts.find((post) => post.slug_en === slug || post.slug_pt === slug) || null;
}

export async function loadProjectById(id: string) {
  const projects = loadProjects();
  return projects.find((project) => project.id === id) || null;
}

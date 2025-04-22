import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import fs from "fs";
import path from "path";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-") // Substitui caracteres não alfanuméricos por hífen
    .replace(/(^-|-$)+/g, ""); // Remove hífens do início e fim
}

export function formatDate(date: string, lang: string): string {
  return new Date(date).toLocaleDateString(
    lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function loadSkills() {
  try {
    const dataDir = path.join(process.cwd(), "content/data");
    ensureDirectoryExists(dataDir);
    
    const skillsPath = path.join(dataDir, "skills.json");
    if (!fs.existsSync(skillsPath)) {
      // Create default skills file if it doesn't exist
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

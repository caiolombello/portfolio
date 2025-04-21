import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ProfileSchema,
  SkillSchema,
  ExperienceSchema,
  EducationSchema,
  CertificationSchema,
  ProjectSchema,
  PostSchema,
} from "../lib/validation.js";
import { z } from "zod";
import matter from "gray-matter";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "content");

async function validateJsonFile(
  filePath: string,
  schema: z.ZodType,
  fileName: string,
) {
  try {
    const content = await readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    schema.parse(data);
    console.log(`✅ ${fileName} is valid`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Validation failed for ${fileName}:`);
      console.error(error.errors);
      process.exit(1);
    } else {
      console.error(`❌ Error processing ${fileName}:`, error);
      process.exit(1);
    }
  }
}

async function validateMarkdownFile(
  filePath: string,
  schema: z.ZodType,
  fileName: string,
) {
  try {
    const content = await readFile(filePath, "utf-8");
    const { data } = matter(content);
    schema.parse(data);
    console.log(`✅ ${fileName} is valid`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Validation failed for ${fileName}:`);
      console.error(error.errors);
      process.exit(1);
    } else {
      console.error(`❌ Error processing ${fileName}:`, error);
      process.exit(1);
    }
  }
}

async function validateDirectory(
  dirPath: string,
  schema: z.ZodType,
  isMarkdown = false,
) {
  try {
    const files = await readdir(dirPath);
    const validationPromises = files
      .filter((file) =>
        isMarkdown ? file.endsWith(".md") : file.endsWith(".json"),
      )
      .map((file) => {
        const filePath = join(dirPath, file);
        return isMarkdown
          ? validateMarkdownFile(filePath, schema, file)
          : validateJsonFile(filePath, schema, file);
      });

    await Promise.all(validationPromises);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      console.warn(`⚠️ Directory ${dirPath} does not exist, skipping...`);
      return;
    }
    console.error(`❌ Error reading directory ${dirPath}:`, error);
    process.exit(1);
  }
}

async function validateContent() {
  try {
    console.log("🔍 Starting content validation...\n");

    // Validate settings (profile)
    console.log("Validating profile...");
    await validateJsonFile(
      join(CONTENT_DIR, "settings", "profile.json"),
      ProfileSchema,
      "profile.json",
    ).catch(() => console.warn("⚠️ Profile file not found, skipping..."));

    // Validate skills
    console.log("\nValidating skills...");
    await validateJsonFile(
      join(CONTENT_DIR, "data", "skills.json"),
      z.object({ skills_list: z.array(SkillSchema) }),
      "skills.json",
    ).catch(() => console.warn("⚠️ Skills file not found, skipping..."));

    // Validate experience entries
    console.log("\nValidating experience entries...");
    await validateDirectory(join(CONTENT_DIR, "experience"), ExperienceSchema);

    // Validate education entries
    console.log("\nValidating education entries...");
    await validateDirectory(join(CONTENT_DIR, "education"), EducationSchema);

    // Validate certification entries
    console.log("\nValidating certification entries...");
    await validateDirectory(
      join(CONTENT_DIR, "certifications"),
      CertificationSchema,
    );

    // Validate project entries
    console.log("\nValidating project entries...");
    await validateDirectory(join(CONTENT_DIR, "projects"), ProjectSchema);

    // Validate blog posts (markdown files)
    console.log("\nValidating blog posts...");
    await validateDirectory(join(CONTENT_DIR, "posts"), PostSchema, true);

    console.log("\n✨ All content files are valid!");
  } catch (error) {
    console.error("\n❌ Validation failed:", error);
    process.exit(1);
  }
}

validateContent();

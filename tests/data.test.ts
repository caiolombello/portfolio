import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import fs, { PathLike, PathOrFileDescriptor } from "fs";
import fsPromises from "fs/promises";
import path from "path";
import {
  ProfileSchema,
  SkillsDataSchema,
  ExperienceSchema,
  EducationSchema,
  CertificationSchema,
  ProjectSchema,
  PostSchema,
} from "../lib/validation";
import { loadPosts, loadProjectById, loadPostBySlug } from "../lib/data";

vi.mock("fs/promises");
vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof fs>("fs");
  return {
    ...actual,
    default: {
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
      readFileSync: vi.fn(),
    },
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});

const CONTENT_DIR = path.join(process.cwd(), "content");

// Mock data for testing
const mockProfile = {
  pt: {
    name: "Test Name",
    title: "Test Title",
    about: "Test About",
  },
  en: {
    name: "Test Name",
    title: "Test Title",
    about: "Test About",
  },
  email: "test@example.com",
};

const mockSkills = {
  skills_list: [
    {
      name: "Test Skill",
      category: "Linguagens",
      level: "Proficiente",
    },
  ],
};

const mockExperience = {
  company: "Test Company",
  title_pt: "Test Title PT",
  title_en: "Test Title EN",
  period: "2023 - Present",
  responsibilities_pt: [{ item: "Test Responsibility PT" }],
  responsibilities_en: [{ item: "Test Responsibility EN" }],
  startDate: "2023-01-01",
};

const mockEducation = {
  institution: "Test Institution",
  degree_pt: "Test Degree PT",
  degree_en: "Test Degree EN",
  period: "2020 - 2024",
  description_pt: "Test Description PT",
  description_en: "Test Description EN",
  endDate: "2024-12",
};

const mockCertification = {
  name: "Test Certification",
  issuer: "Test Issuer",
  date: "2023-01-01",
  description: "Test Description",
  url: "https://test.com/cert",
};

const mockProject = {
  id: "test-project",
  title_pt: "Test Project PT",
  title_en: "Test Project EN",
  shortDescription_pt: "Test Short Description PT",
  shortDescription_en: "Test Short Description EN",
  description_pt: "Test Description PT",
  description_en: "Test Description EN",
  imageUrl: "/test.jpg",
  category: "Test",
  technologies: [{ tech: "Test Tech" }],
  githubUrl: "https://github.com/test",
  featured: true,
  createdAt: "2023-01-01",
};

const mockPost = {
  title_pt: "Test Post PT",
  title_en: "Test Post EN",
  summary_pt: "Test Summary PT",
  summary_en: "Test Summary EN",
  publicationDate: "2023-01-01",
  category: "Test",
  tags: ["test"],
  author: { name: "Test Author" },
  published: true,
  body_pt: "Test Content PT",
  body_en: "Test Content EN",
};

describe("Content Validation", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock fs.existsSync to always return true
    (fs.existsSync as Mock).mockReturnValue(true);

    // Mock fs.readdirSync to return appropriate test files
    (fs.readdirSync as Mock).mockImplementation((path: string) => {
      if (path.includes("experience")) return ["test-experience.json"];
      if (path.includes("education")) return ["test-education.json"];
      if (path.includes("certifications")) return ["test-certification.json"];
      if (path.includes("projects")) return ["test-project.json"];
      if (path.includes("posts")) return ["test-post.md"];
      return [];
    });

    // Mock fs.readFileSync to return appropriate test data
    (fs.readFileSync as Mock).mockImplementation((path: string) => {
      if (path.includes("profile.json")) return JSON.stringify(mockProfile);
      if (path.includes("skills.json")) return JSON.stringify(mockSkills);
      if (path.includes("experience")) return JSON.stringify(mockExperience);
      if (path.includes("education")) return JSON.stringify(mockEducation);
      if (path.includes("certification"))
        return JSON.stringify(mockCertification);
      if (path.includes("project")) return JSON.stringify(mockProject);
      if (path.includes("post")) {
        return `---\n${JSON.stringify(mockPost, null, 2)}\n---\n${mockPost.body_pt}\n---\n${mockPost.body_en}`;
      }
      return "";
    });
  });

  test("Profile file is valid", () => {
    const filePath = path.join(CONTENT_DIR, "settings", "profile.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      expect(() => ProfileSchema.parse(data)).not.toThrow();
    }
  });

  test("Skills file is valid", () => {
    const filePath = path.join(CONTENT_DIR, "data", "skills.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      expect(() => SkillsDataSchema.parse(data)).not.toThrow();
    }
  });

  test("Experience files are valid", () => {
    const dirPath = path.join(CONTENT_DIR, "experience");
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const data = JSON.parse(
          fs.readFileSync(path.join(dirPath, file), "utf-8"),
        );
        expect(() => ExperienceSchema.parse(data)).not.toThrow();
      });
    }
  });

  test("Education files are valid", () => {
    const dirPath = path.join(CONTENT_DIR, "education");
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const data = JSON.parse(
          fs.readFileSync(path.join(dirPath, file), "utf-8"),
        );
        expect(() => EducationSchema.parse(data)).not.toThrow();
      });
    }
  });

  test("Certification files are valid", () => {
    const dirPath = path.join(CONTENT_DIR, "certifications");
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const data = JSON.parse(
          fs.readFileSync(path.join(dirPath, file), "utf-8"),
        );
        expect(() => CertificationSchema.parse(data)).not.toThrow();
      });
    }
  });

  test("Project files are valid", () => {
    const dirPath = path.join(CONTENT_DIR, "projects");
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const data = JSON.parse(
          fs.readFileSync(path.join(dirPath, file), "utf-8"),
        );
        expect(() => ProjectSchema.parse(data)).not.toThrow();
      });
    }
  });

  test("Blog post files are valid", () => {
    const dirPath = path.join(CONTENT_DIR, "posts");
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
      files.forEach((file) => {
        const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
        const [, frontmatter, ...bodyParts] = content.split("---");
        const slug = file.replace(/\.md$/, "");
        const data = {
          ...JSON.parse(frontmatter),
          slug_pt: slug,
          slug_en: slug,
          body_pt: bodyParts[0]?.trim() || "",
          body_en: bodyParts[1]?.trim() || "",
        };
        expect(() => PostSchema.parse(data)).not.toThrow();
      });
    }
  });
});

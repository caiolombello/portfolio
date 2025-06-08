import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

interface SiteConfig {
  site: {
    name: string;
    title: string;
    shortName: string;
    description: string;
    url: string;
    author: string;
    email: string;
    location: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
}

interface Post {
  slug: string;
  title: string;
  description: string;
}

interface Skill {
  name: string;
}

// Função para carregar configuração do site
async function loadSiteConfig(): Promise<SiteConfig> {
  try {
    const configPath = path.join(process.cwd(), "config/site.json");
    const configData = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    // Fallback para configurações padrão
    console.warn("Site config not found, using defaults");
    return {
      site: {
        name: "Portfolio Template",
        title: "Your Name - Professional Portfolio",
        shortName: "Your Name",
        description: "Professional portfolio and blog",
        url: "https://yoursite.com",
        author: "Your Name",
        email: "your.email@example.com",
        location: "Your Location",
      },
      social: {
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourprofile",
        twitter: "https://twitter.com/yourusername",
        website: "https://yoursite.com",
      },
    };
  }
}

// Função para carregar perfil
async function loadProfile() {
  try {
    const profilePath = path.join(process.cwd(), "content/profile/profile.json");
    const profileData = await fs.readFile(profilePath, "utf-8");
    return JSON.parse(profileData);
  } catch (error) {
    return null;
  }
}

// Função para carregar projetos
async function loadProjects(): Promise<Project[]> {
  try {
    const projectsDir = path.join(process.cwd(), "content/projects");
    const files = await fs.readdir(projectsDir);
    const projects: Project[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const projectPath = path.join(projectsDir, file);
        const projectData = await fs.readFile(projectPath, "utf-8");
        const project = JSON.parse(projectData);
        projects.push({
          id: project.id,
          title: project.title,
          description: project.description,
          shortDescription: project.shortDescription || project.description,
        });
      }
    }

    return projects.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    return [];
  }
}

// Função para carregar posts do blog
async function loadPosts(): Promise<Post[]> {
  try {
    const postsDir = path.join(process.cwd(), "content/posts");
    const files = await fs.readdir(postsDir);
    const posts: Post[] = [];

    for (const file of files) {
      if (file.endsWith(".md")) {
        const postPath = path.join(postsDir, file);
        const postContent = await fs.readFile(postPath, "utf-8");
        const { data } = matter(postContent);
        
        if (data.published !== false) {
          posts.push({
            slug: file.replace(".md", ""),
            title: data.title,
            description: data.description,
          });
        }
      }
    }

    return posts.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    return [];
  }
}

// Função para carregar skills
async function loadSkills(): Promise<Skill[]> {
  try {
    const skillsPath = path.join(process.cwd(), "content/skills/skills.json");
    const skillsData = await fs.readFile(skillsPath, "utf-8");
    const { skills_list } = JSON.parse(skillsData);
    return skills_list || [];
  } catch (error) {
    return [];
  }
}

// Função para gerar o conteúdo do llms.txt dinamicamente
async function generateLlmsTxt() {
  try {
    // Carregar dados necessários
    const config = await loadSiteConfig();
    const profile = await loadProfile();
    const projects = await loadProjects();
    const posts = await loadPosts();
    const skills = await loadSkills();

    const baseUrl = config.site.url;
    const authorName = config.site.shortName;
    const authorTitle = profile?.pt?.title || config.site.author;
    const authorAbout = profile?.pt?.about || config.site.description;

    // Gerar o conteúdo do llms.txt
    const content = `# ${authorName} - Professional Portfolio

> Professional portfolio website of ${authorName}, a ${authorTitle}. The site showcases professional experience, projects, technical articles, and contact information.

This site is built with Next.js and Tailwind CSS, featuring a modern dark theme with responsive design. The site is available in multiple languages (Portuguese, English, and Spanish).

## Professional Profile

- [About Me](${baseUrl}/): ${authorAbout}
- [Resume](${baseUrl}/resume/): Detailed professional experience, education, and technical certifications
- [Contact](${baseUrl}/contact/): Contact information and message form

## Social Networks

- LinkedIn: ${config.social.linkedin}
- GitHub: ${config.social.github}
- Twitter: ${config.social.twitter}
- Website: ${config.social.website}

## Projects

- [Portfolio Projects](${baseUrl}/portfolio/): Overview of all developed projects
${projects.map((project: Project) => `- [${project.title}](${baseUrl}/portfolio/${project.id}/): ${project.shortDescription}`).join("\n")}

## Blog

- [Blog](${baseUrl}/blog/): Technical articles about development, DevOps, cloud technologies, and software engineering
${posts.map((post: Post) => `- [${post.title}](${baseUrl}/blog/${post.slug}/): ${post.description}`).join("\n")}

## Technologies

- [Technical Skills](${baseUrl}/resume/#skills): ${skills.map((skill: Skill) => skill.name).join(", ")}
- [Certifications](${baseUrl}/resume/#certifications): Professional certifications and technical achievements

## Contact Information

- Email: ${config.site.email}
- Location: ${config.site.location}

## Optional

- [Privacy Policy](${baseUrl}/privacy-policy/): Information about how user data is handled on the site
- [Terms of Use](${baseUrl}/terms-of-use/): Terms and conditions for site usage

---

This portfolio showcases the professional work and expertise of ${authorName}, demonstrating skills in modern web development, cloud technologies, and software engineering best practices.`;

    return content;
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return `# Professional Portfolio

> An error occurred while generating dynamic content. Please try again later.`;
  }
}

export async function GET() {
  const content = await generateLlmsTxt();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache por 1 hora
      "X-Content-Source": "dynamic", // Indica que é gerado dinamicamente
    },
  });
}

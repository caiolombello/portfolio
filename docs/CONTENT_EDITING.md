# Content Editing Guide

This guide explains how to manage content for the portfolio website using static files (JSON and Markdown).

## Content Structure

The portfolio uses a file-based content system located in the `/content` directory. All content is version-controlled with Git and automatically deployed.

## Content Types & Locations

### Profile (`/content/profile/profile.json`)

Personal information with multilingual support:

```json
{
  "pt": {
    "name": "Caio Barbieri",
    "title": "Engenheiro DevOps Pleno",
    "location": "Campinas, São Paulo, Brasil",
    "about": "Sua bio em português..."
  },
  "en": {
    "name": "Caio Barbieri", 
    "title": "Mid-level DevOps Engineer",
    "location": "Campinas, São Paulo, Brazil",
    "about": "Your bio in English..."
  },
  "email": "caio@lombello.com",
  "phone": "+55 (19) 99753-6692",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/caiolvbarbieri",
    "github": "https://github.com/caiolombello",
    "twitter": "https://twitter.com/caiolombello",
    "website": "https://caio.lombello.com",
    "whatsapp": "https://wa.me/5519997536692"
  }
}
```

### Skills (`/content/skills/skills.json`)

Technical skills organized by category:

```json
{
  "skills_list": [
    {
      "name": "TypeScript",
      "category": "Linguagens",
      "level": "Experiente"
    },
    {
      "name": "AWS",
      "category": "Cloud/Infra",
      "level": "Avançado"
    }
  ]
}
```

**Available Categories:**
- Linguagens
- Frontend
- Backend
- Cloud/Infra
- CI/CD
- Observabilidade
- Databases

**Available Levels:**
- Avançado
- Experiente
- Proficiente
- Familiarizado

### Experience (`/content/experience/`)

Individual JSON files for each professional experience:

**File naming:** `company-year-position.json` (e.g., `vertigo-tecnologia-2024.json`)

```json
{
  "id": "vertigo-tecnologia-2024",
  "company": "Vertigo Tecnologia",
  "position": {
    "pt": "Engenheiro DevOps Pleno",
    "en": "Mid-level DevOps Engineer"
  },
  "period": "Mar 2024 - Atual",
  "startDate": "2024-03-01",
  "endDate": null,
  "location": "Campinas, SP",
  "responsibilities": {
    "pt": [
      "Implementação de pipelines CI/CD com GitLab",
      "Automação de infraestrutura com Terraform"
    ],
    "en": [
      "Implementation of CI/CD pipelines with GitLab",
      "Infrastructure automation with Terraform"
    ]
  },
  "technologies": ["AWS", "Terraform", "GitLab CI", "Kubernetes"]
}
```

### Education (`/content/education/`)

Individual JSON files for each educational entry with multilingual support:

**File naming:** `institution-year.json` (e.g., `estacio-2025.json`)

```json
{
  "institution": "Universidade Estácio de Sá",
  "degree_pt": "Bacharelado em Ciência da Computação",
  "degree_en": "Bachelor's Degree in Computer Science",
  "period": "2023 - 2025",
  "description_pt": "Curso superior em Ciência da Computação com foco em desenvolvimento de software, algoritmos, estruturas de dados e tecnologias emergentes.",
  "description_en": "Bachelor's degree in Computer Science focused on software development, algorithms, data structures and emerging technologies.",
  "endDate": "2025-12-01"
}
```

**Required Fields:**
- `institution`: Name of the educational institution
- `degree_pt`: Degree name in Portuguese
- `degree_en`: Degree name in English  
- `period`: Period of study (e.g., "2023 - 2025")

**Optional Fields:**
- `description_pt`: Description in Portuguese
- `description_en`: Description in English
- `endDate`: Expected or actual end date (ISO format)

### Certifications (Credly Integration)

Professional certifications are **automatically fetched** from Credly API:

- **No manual editing required**
- Data cached for 24 hours for optimal performance
- Automatically displays badges, issuers, and verification links
- Username configured: `caiolombello`

To add/remove certifications, manage them directly in your Credly profile.

### Projects (`/content/projects/`)

Individual JSON files for each portfolio project:

**File naming:** `project-slug.json` (e.g., `portfolio-website.json`)

```json
{
  "id": "portfolio-website",
  "title": "Portfolio Pessoal",
  "description": "Portfolio moderno desenvolvido com Next.js 15...",
  "image": "/images/projects/portfolio.jpg",
  "technologies": ["Next.js", "TypeScript", "Tailwind CSS"],
  "category": "Web Development",
  "featured": true,
  "github": "https://github.com/caiolombello/portfolio",
  "demo": "https://caio.lombello.com",
  "status": "Concluído",
  "startDate": "2024-01-01",
  "endDate": "2024-02-01"
}
```

### Blog Posts (`/content/posts/`)

Markdown files with frontmatter:

**File naming:** `post-slug.md` (e.g., `introducao-devops.md`)

```markdown
---
title: "Introdução ao DevOps"
description: "Conceitos fundamentais sobre DevOps e sua importância."
date: "2024-01-15"
author: "Caio Barbieri"
tags: ["devops", "automation", "infrastructure"]
coverImage: "/images/blog/devops-intro.jpg"
published: true
---

# Introdução ao DevOps

Content here in **Markdown** format...

## Seção

- Lista item 1
- Lista item 2

```code
// Bloco de código
function example() {
  return "Hello World";
}
```

```

## Editing Workflow

### 1. Local Development

```bash
# Clone the repository
git clone https://github.com/caiolombello/portfolio.git
cd portfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 2. Making Changes

1. **Edit files directly** in `/content` directory
2. **Preview changes** at `http://localhost:3000`
3. **Test the build** with `pnpm build`
4. **Commit changes** to Git

### 3. Deployment

```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "feat: add new blog post about DevOps"

# Push to trigger deployment
git push origin main
```

Changes are **automatically deployed** via Vercel when pushed to the main branch.

## Best Practices

### 1. File Organization
- Use descriptive file names
- Follow naming conventions (`kebab-case`)
- Keep files organized in appropriate directories

### 2. Content Quality
- **Bilingual support**: Provide both PT and EN content where applicable
- **Consistent formatting**: Follow JSON structure exactly
- **Valid syntax**: Validate JSON before committing
- **SEO optimization**: Use descriptive titles and descriptions

### 3. Images
- Store in `/public/images/`
- Use optimized formats (WebP, AVIF)
- Include descriptive alt text
- Maximum size: 2MB

### 4. Markdown Guidelines
- Use proper heading hierarchy (`#` → `##` → `###`)
- Include language tags in code blocks
- Add alt text to images: `![Alt text](image.jpg)`
- Use tables and lists for better organization

## Validation

The system automatically validates:
- JSON syntax and structure
- Required fields presence
- Data types and formats
- File naming conventions

## Common Tasks

### Adding a New Blog Post

1. Create `content/posts/my-new-post.md`
2. Add frontmatter with required fields
3. Write content in Markdown
4. Add images to `/public/images/blog/`
5. Test locally and commit

### Adding a New Project

1. Create `content/projects/my-project.json`
2. Fill all required fields
3. Add project image to `/public/images/projects/`
4. Set `featured: true` for highlighting
5. Test and commit

### Updating Profile

1. Edit `content/profile/profile.json`
2. Update both PT and EN sections
3. Verify social links are working
4. Test and commit

### Adding New Skills

1. Edit `content/skills/skills.json`
2. Add skills to `skills_list` array
3. Use existing categories and levels
4. Test and commit

## Troubleshooting

### Build Errors
- Check JSON syntax with online validator
- Verify all required fields are present
- Ensure file names follow conventions

### Missing Content
- Check file paths are correct
- Verify JSON structure matches schema
- Ensure proper encoding (UTF-8)

### Images Not Loading
- Verify images exist in `/public/images/`
- Check file paths in content files
- Ensure proper image formats

## Getting Help

- **Documentation**: Check `/docs` directory
- **Issues**: Open GitHub issue for bugs
- **Structure**: Refer to `content/README.md`
- **Examples**: Look at existing content files

## Content Backup

All content is automatically backed up through:
- **Git version control**: Full history of changes
- **GitHub repository**: Cloud backup
- **Vercel deployments**: Deployment history

## Advanced Features

### Custom Components
Blog posts support custom React components:

```markdown
<CustomComponent prop="value" />
```

### SEO Optimization
- Automatic sitemap generation
- Open Graph meta tags
- Structured data for blog posts
- Optimized meta descriptions

Remember: All changes are tracked in Git and can be easily reverted if needed.

# 🛠️ Configuration Guide

This portfolio template is designed to be easily configurable for anyone to use. Follow this guide to customize it for your own use.

## 🚀 Quick Setup

1. **Copy the configuration template:**
   ```bash
   cp config/site.json.template config/site.json
   ```

2. **Edit your site configuration:**
   Open `config/site.json` and replace all placeholder values with your own information.

3. **Configure your content:**
   Update the files in the `content/` directory with your own data.

## ⚙️ Configuration Files

### 📄 Site Configuration (`config/site.json`)

This is the main configuration file that controls your portfolio's basic information:

```json
{
  "site": {
    "name": "Your Portfolio Name",           // Used in browser tab, meta tags
    "title": "Your Name - Your Profession", // Main title for SEO
    "shortName": "Your Name",               // Used in headers, footers
    "description": "Your description...",   // Meta description for SEO
    "url": "https://yourdomain.com",        // Your site URL
    "author": "Your Full Name",             // Author name
    "email": "your.email@example.com",      // Contact email
    "phone": "+1 (555) 123-4567",          // Contact phone
    "location": "Your City, Country",       // Your location
    "profileImage": "/images/profile/profile.jpg"  // Path to your profile image
  },
  "social": {
    "github": "https://github.com/username",     // Your GitHub URL
    "linkedin": "https://linkedin.com/in/you",  // Your LinkedIn URL
    "twitter": "https://twitter.com/username",  // Your Twitter URL
    "website": "https://yourdomain.com"         // Your website URL
  },
  "integrations": {
    "credlyUsername": "your-credly-username",   // Your Credly username (optional)
    "twitterHandle": "@yourusername"            // Your Twitter handle
  },
  "seo": {
    "keywords": [                              // SEO keywords for your site
      "your profession",
      "your skills",
      "your location"
    ]
  }
}
```

### 📁 Content Configuration

#### Profile Information (`content/profile/profile.json`)

Your personal and professional information with multilingual support:

```json
{
  "pt": {
    "name": "Your Name",
    "title": "Your Job Title in Portuguese", 
    "location": "Your City, Country",
    "about": "Your bio in Portuguese..."
  },
  "en": {
    "name": "Your Name",
    "title": "Your Job Title in English",
    "location": "Your City, Country", 
    "about": "Your bio in English..."
  },
  "email": "your.email@example.com",
  "phone": "+1 (555) 123-4567",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/you",
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "website": "https://yourdomain.com"
  }
}
```

#### Skills (`content/skills/skills.json`)

Your technical skills organized by category:

```json
{
  "skills_list": [
    {
      "name": "JavaScript",
      "category": "Linguagens", 
      "level": "Avançado"
    }
  ]
}
```

**Available Categories:**
- `Linguagens` - Programming languages
- `Frontend` - Frontend technologies
- `Backend` - Backend technologies  
- `Cloud/Infra` - Cloud and infrastructure
- `CI/CD` - DevOps and automation
- `Observabilidade` - Monitoring and observability
- `Banco de Dados` - Databases

**Available Levels:**
- `Avançado` - Advanced
- `Experiente` - Experienced
- `Proficiente` - Proficient
- `Familiarizado` - Familiar

#### Experience (`content/experience/`)

Professional experience files (one JSON file per job):

**Filename format:** `company-year-position.json`

```json
{
  "company": "Company Name",
  "title_pt": "Job Title in Portuguese", 
  "title_en": "Job Title in English",
  "period": "Jan 2023 - Present",
  "responsibilities_pt": [
    { "item": "Achievement in Portuguese with metrics..." }
  ],
  "responsibilities_en": [
    { "item": "Achievement in English with metrics..." }
  ],
  "startDate": "2023-01-01"
}
```

#### Education (`content/education/`)

Educational background (one JSON file per degree):

**Filename format:** `institution-year.json`

```json
{
  "institution": "University Name",
  "degree_pt": "Degree Name in Portuguese",
  "degree_en": "Degree Name in English", 
  "period": "2020 - 2024",
  "description_pt": "Description in Portuguese...",
  "description_en": "Description in English...",
  "endDate": "2024-12-01"
}
```

#### Projects (`content/projects/`)

Portfolio projects (one JSON file per project):

**Filename format:** `project-slug.json`

```json
{
  "id": "project-slug",
  "title": "Project Title",
  "description": "Project description...",
  "image": "/images/projects/project.jpg",
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "Web Development",
  "featured": true,
  "github": "https://github.com/username/project",
  "demo": "https://project-demo.com",
  "status": "Completed",
  "startDate": "2024-01-01",
  "endDate": "2024-02-01"
}
```

#### Blog Posts (`content/posts/`)

Blog posts in Markdown format:

**Filename format:** `post-slug.md`

```markdown
---
title: "Post Title"
description: "Post description"
date: "2024-01-15"
author: "Your Name"
tags: ["tag1", "tag2"]
coverImage: "/images/blog/post.jpg"
published: true
---

# Your post content here

Content in **Markdown** format...
```

## 🎨 Customization

### Images

#### Profile Image Configuration

Your profile image is configured in `config/site.json` under `site.profileImage`:

```json
{
  "site": {
    "profileImage": "/images/profile/profile.jpg"
  }
}
```

This image will be automatically used in:
- **Header navigation** (when not on home/contact pages)
- **About page** (main profile section)
- **Contact page** (header section)
- **Mobile menu** (profile avatar)

**Recommended specifications:**
- **Format**: JPG, PNG, or WebP
- **Size**: 400x400px minimum (square aspect ratio)
- **Quality**: High resolution for best results
- **File size**: Under 500KB for optimal loading

#### Image Directories

- **Profile photos:** `/public/images/profile/`
- **Project images:** `/public/images/projects/`  
- **Blog post images:** `/public/images/blog/`
- **General images:** `/public/images/`

### Styling

The site uses Tailwind CSS. You can customize:

- **Colors:** Update theme colors in `tailwind.config.ts`
- **Fonts:** Modify font imports in `app/layout.tsx`
- **Components:** Edit component styles in `/components`

### Integrations

#### Credly Certifications

To display your Credly certifications:

1. Set your Credly username in `config/site.json`:
   ```json
   "integrations": {
     "credlyUsername": "your-actual-credly-username"
   }
   ```

2. Certifications will automatically appear in your resume section.

## 🔍 Dynamic SEO System

The portfolio automatically generates SEO metadata based on your configuration:

### Automatic Generation
- **Page titles**: Uses your site configuration and content
- **Meta descriptions**: Dynamic based on page content
- **Open Graph tags**: Automatic image generation and social previews
- **Twitter Cards**: Optimized for social media sharing
- **Structured data**: JSON-LD for search engines
- **Canonical URLs**: Prevents duplicate content issues

### SEO Features
- **Dynamic sitemap**: Automatically includes all pages and posts
- **Progressive Web App**: Optimized manifest and service worker
- **Image optimization**: Automatic Open Graph image generation
- **Multi-language support**: Proper hreflang tags
- **Schema markup**: Rich snippets for better search results

### Configuration
All SEO metadata is generated from your `config/site.json`:
- Site title and description
- Social media handles
- Keywords and categories  
- Contact information
- Social links

No need to manually edit meta tags - everything updates automatically when you change your configuration!

## 🤖 AI Integration

The portfolio automatically generates a `llms.txt` file for AI assistants:

- **Dynamic generation**: Always up-to-date with your content
- **Structured data**: Professional profile, projects, blog posts, and skills
- **LLM-friendly**: Helps AI understand your portfolio content
- **Automatic updates**: Regenerates when content changes

Access your `llms.txt` at: `https://yoursite.com/llms.txt`

For details, see [LLMS_TXT.md](docs/LLMS_TXT.md).

## 🖼️ Dynamic Social Media Previews

When you share your portfolio links on social media, they automatically show professional preview images:

### Features
- **Your profile photo** prominently displayed
- **Professional branding** with gold accents and dark theme  
- **"PROFESSIONAL PORTFOLIO" badge** for credibility
- **Dynamic content** based on your configuration
- **Consistent design** across all platforms

### Supported Platforms
- Facebook, Twitter, LinkedIn, WhatsApp
- Discord, Slack, iMessage
- Any platform supporting Open Graph images

### How to Test
Use these tools to preview how your links appear:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator  
- **LinkedIn**: https://www.linkedin.com/post-inspector/

For detailed information, see [SOCIAL_PREVIEW.md](docs/SOCIAL_PREVIEW.md).

## 🚀 Deployment

The portfolio is configured for easy deployment on Vercel:

1. **Push to GitHub:** All your changes
2. **Connect Vercel:** Import your repository
3. **Configure domain:** Set up your custom domain
4. **Environment variables:** Add any needed env vars

## 📝 Content Management

### Adding New Content

- **New job:** Add a new JSON file to `content/experience/`
- **New project:** Add a new JSON file to `content/projects/`  
- **New blog post:** Add a new Markdown file to `content/posts/`
- **New education:** Add a new JSON file to `content/education/`

### Best Practices

- **Use consistent naming:** Follow the filename conventions
- **Include metrics:** Quantify achievements with numbers
- **Optimize images:** Compress images before adding them
- **Test locally:** Always test changes with `npm run dev`

## 🆘 Troubleshooting

### Common Issues

**Config not loading:**
- Check that `config/site.json` exists and has valid JSON
- Verify all required fields are present

**Credly not working:**
- Ensure username is correct in config
- Check that Credly profile is public

**Build errors:**
- Validate all JSON files with an online JSON validator
- Check that all required fields are present
- Ensure file naming conventions are followed

## 🤝 Contributing

If you improve this template, consider contributing back:

1. Fork the repository
2. Make your improvements
3. Submit a pull request
4. Help others build great portfolios!

---

**Happy building!** 🚀 Your professional portfolio awaits. 
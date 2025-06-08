# 📋 Usage Example

This document shows how to set up your own portfolio using this template.

## 🚀 Step-by-Step Setup

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/caiolombello/portfolio.git
cd portfolio

# Install dependencies
npm install

# Copy configuration template
cp config/site.json.template config/site.json
```

### 2. Configure Your Site

Edit `config/site.json` with your information:

```json
{
  "site": {
    "name": "John Doe Portfolio",
    "title": "John Doe - Full Stack Developer",
    "shortName": "John Doe",
    "description": "Full Stack Developer specializing in React, Node.js, and cloud technologies",
    "url": "https://johndoe.dev",
    "author": "John Doe",
    "email": "john@johndoe.dev",
    "phone": "+1 (555) 987-6543",
    "location": "San Francisco, CA, USA",
    "profileImage": "/images/profile/john-doe.jpg"
  },
  "social": {
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe_dev",
    "website": "https://johndoe.dev"
  },
  "integrations": {
    "credlyUsername": "john-doe",
    "twitterHandle": "@johndoe_dev"
  },
  "seo": {
    "keywords": [
      "Full Stack Developer",
      "React",
      "Node.js",
      "TypeScript",
      "AWS",
      "San Francisco"
    ]
  }
}
```

### 3. Update Your Profile

Edit `content/profile/profile.json`:

```json
{
  "pt": {
    "name": "John Doe",
    "title": "Desenvolvedor Full Stack",
    "location": "São Francisco, CA, EUA",
    "about": "Desenvolvedor Full Stack apaixonado por tecnologia com 5+ anos de experiência..."
  },
  "en": {
    "name": "John Doe",
    "title": "Full Stack Developer",
    "location": "San Francisco, CA, USA",
    "about": "Passionate Full Stack Developer with 5+ years of experience..."
  },
  "email": "john@johndoe.dev",
  "phone": "+1 (555) 987-6543",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "twitter": "https://twitter.com/johndoe_dev",
    "website": "https://johndoe.dev"
  }
}
```

### 4. Add Your Skills

Edit `content/skills/skills.json`:

```json
{
  "skills_list": [
    {
      "name": "JavaScript",
      "category": "Linguagens",
      "level": "Avançado"
    },
    {
      "name": "React",
      "category": "Frontend",
      "level": "Avançado"
    },
    {
      "name": "Node.js",
      "category": "Backend",
      "level": "Experiente"
    },
    {
      "name": "AWS",
      "category": "Cloud/Infra",
      "level": "Proficiente"
    }
  ]
}
```

### 5. Add Your Experience

Create `content/experience/techcorp-2023-senior-developer.json`:

```json
{
  "company": "TechCorp Inc.",
  "title_pt": "Desenvolvedor Senior",
  "title_en": "Senior Developer",
  "period": "Jan 2023 - Present",
  "responsibilities_pt": [
    { "item": "Liderou equipe de 4 desenvolvedores em projetos React/Node.js" },
    { "item": "Implementou arquitetura de microserviços reduzindo latência em 40%" },
    { "item": "Mentoreou 6 desenvolvedores juniores resultando em 90% de retenção" }
  ],
  "responsibilities_en": [
    { "item": "Led team of 4 developers on React/Node.js projects" },
    { "item": "Implemented microservices architecture reducing latency by 40%" },
    { "item": "Mentored 6 junior developers achieving 90% retention rate" }
  ],
  "startDate": "2023-01-01"
}
```

### 6. Add Your Projects

Create `content/projects/ecommerce-platform.json`:

```json
{
  "id": "ecommerce-platform",
  "title": "E-commerce Platform",
  "description": "Modern e-commerce platform built with React, Node.js, and PostgreSQL",
  "image": "/images/projects/ecommerce.jpg",
  "technologies": ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
  "category": "Web Development",
  "featured": true,
  "github": "https://github.com/johndoe/ecommerce-platform",
  "demo": "https://ecommerce-demo.johndoe.dev",
  "status": "Completed",
  "startDate": "2024-01-01",
  "endDate": "2024-03-01"
}
```

### 7. Write Your First Blog Post

Create `content/posts/my-journey-into-full-stack-development.md`:

```markdown
---
title: "My Journey into Full Stack Development"
description: "How I transitioned from frontend to full stack development and the lessons learned along the way"
date: "2024-01-15"
author: "John Doe"
tags: ["career", "development", "learning"]
coverImage: "/images/blog/journey.jpg"
published: true
---

# My Journey into Full Stack Development

When I started my career as a frontend developer, I never imagined I'd fall in love with backend technologies...

## The Beginning

It all started when I was working on a React project and needed to understand how the API worked...

## Key Lessons Learned

1. **Start with the fundamentals**
2. **Practice consistently**
3. **Don't be afraid to break things**

## What's Next?

Looking forward, I'm excited to dive deeper into cloud architecture...
```

### 8. Add Your Images

```bash
# Add your profile photo (use the same name as configured in site.json)
cp your-photo.jpg public/images/profile/john-doe.jpg

# Add project images
cp project1.jpg public/images/projects/ecommerce.jpg

# Add blog images  
cp blog-cover.jpg public/images/blog/journey.jpg
```

**Important**: Make sure the profile image filename matches the path in your `config/site.json`.

### 9. Test Your Site

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 10. Deploy

```bash
# Push to GitHub
git add .
git commit -m "feat: initial portfolio setup"
git push origin main

# Deploy on Vercel
# 1. Go to vercel.com
# 2. Import your GitHub repository
# 3. Deploy with default settings
```

## 🎯 Tips for Success

### Content Tips
- **Use metrics in experience**: "Increased performance by 40%"
- **Show impact in projects**: "Served 10k+ users"
- **Write engaging blog posts**: Share your learning journey
- **Keep skills updated**: Add new technologies as you learn

### SEO Tips
- **Optimize images**: Compress before uploading
- **Use descriptive alt text**: For accessibility and SEO
- **Write good meta descriptions**: In your config
- **Update keywords regularly**: Based on your focus areas

### Maintenance
- **Update content regularly**: Keep projects and experience current
- **Monitor performance**: Use Vercel Analytics
- **Backup your content**: Commit changes to Git
- **Test on mobile**: Ensure responsive design works

## 🔄 Making Updates

### Adding New Content
```bash
# New blog post
touch content/posts/new-post.md

# New project
touch content/projects/new-project.json

# New job experience
touch content/experience/company-2024-role.json
```

### Updating Design
```bash
# Modify colors
nano tailwind.config.ts

# Update components
nano components/ui/button.tsx

# Add new sections
nano components/custom-section.tsx
```

## 🚀 Going Live

Your portfolio is now ready! Share it with:
- Potential employers
- Clients and customers  
- The developer community
- Your professional network

Remember to keep it updated as you grow in your career!

---

**Need help?** Check out the full [Configuration Guide](CONFIG.md) or [open an issue](https://github.com/caiolombello/portfolio/issues). 
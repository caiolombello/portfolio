# 📄 Dynamic llms.txt Documentation

This portfolio automatically generates a `llms.txt` file that provides LLMs (Large Language Models) with structured information about your portfolio content.

## 🤖 What is llms.txt?

The `llms.txt` file is a standardized format that helps AI assistants and LLMs understand the structure and content of your portfolio website. It's automatically generated at `/llms.txt` and includes:

- **Professional profile information**
- **Project listings with descriptions**
- **Blog post summaries**
- **Technical skills**
- **Contact information**
- **Social media links**

## 🔄 Dynamic Generation

Unlike static `llms.txt` files, this portfolio generates the content dynamically by:

1. **Reading site configuration** from `config/site.json`
2. **Loading profile data** from `content/profile/profile.json`
3. **Scanning projects** from `content/projects/*.json`
4. **Indexing blog posts** from `content/posts/*.md`
5. **Listing skills** from `content/skills/skills.json`

## 📋 Generated Content Structure

```
# [Your Name] - Professional Portfolio

> Professional portfolio website of [Your Name], a [Your Title]. 
  The site showcases professional experience, projects, technical articles, and contact information.

## Professional Profile
- About Me: [Your description]
- Resume: Detailed professional experience
- Contact: Contact information and message form

## Social Networks
- LinkedIn: [Your LinkedIn URL]
- GitHub: [Your GitHub URL]
- Twitter: [Your Twitter URL]
- Website: [Your Website URL]

## Projects
- Portfolio Projects: Overview of all developed projects
- [Project 1]: [Project 1 description]
- [Project 2]: [Project 2 description]
...

## Blog
- Blog: Technical articles about your expertise
- [Post 1]: [Post 1 description]
- [Post 2]: [Post 2 description]
...

## Technologies
- Technical Skills: [Comma-separated list of skills]
- Certifications: Professional certifications

## Contact Information
- Email: [Your email]
- Location: [Your location]
```

## 🛠️ Configuration

The dynamic generation uses these configuration sources:

### Site Configuration (`config/site.json`)
- Author name and professional title
- Website URL for link generation
- Contact information
- Social media links

### Profile Data (`content/profile/profile.json`)
- Professional bio/about section
- Localized content (uses Portuguese by default, falls back to English)

### Project Files (`content/projects/*.json`)
- Project titles and descriptions
- Automatically scans all JSON files in the projects directory
- Uses `shortDescription` if available, otherwise falls back to `description`

### Blog Posts (`content/posts/*.md`)
- Post titles and descriptions from frontmatter
- Only includes published posts (`published: true` or omitted)
- Automatically scans all Markdown files

### Skills (`content/skills/skills.json`)
- Technical skills list
- All skills are included in a comma-separated format

## 🚀 Usage

### Accessing the File
The `llms.txt` file is available at:
```
https://yoursite.com/llms.txt
```

### API Endpoint
The generation happens through the API route:
```
/app/llms.txt/route.ts
```

### Caching
- **Browser cache**: 1 hour (`max-age=3600`)
- **CDN cache**: 1 hour (`s-maxage=3600`)
- **Dynamic header**: `X-Content-Source: dynamic`

## 🔄 Updates

The `llms.txt` content automatically updates when:
- Site configuration changes
- Profile information is updated
- New projects are added
- New blog posts are published
- Skills are modified

No manual regeneration is needed - the content is fresh on every request (with appropriate caching).

## 🎯 Benefits

### For LLMs/AI Assistants
- **Structured overview**: Quick understanding of your professional profile
- **Project context**: Detailed information about your work
- **Content discovery**: Easy access to blog posts and technical content
- **Contact information**: Direct access to professional contact details

### For Portfolio Owners
- **Always up-to-date**: Automatically reflects current content
- **No maintenance**: No need to manually update the file
- **Configurable**: Uses your existing content and configuration
- **SEO friendly**: Provides structured data about your portfolio

## 🛡️ Privacy & Security

The `llms.txt` file only includes:
- ✅ **Public information** from your portfolio
- ✅ **Professional content** you've chosen to share
- ✅ **Contact information** from your configuration

It does **NOT** include:
- ❌ **Private configuration** details
- ❌ **Internal system information**
- ❌ **Sensitive data** or credentials

## 🔧 Customization

To customize the `llms.txt` generation:

1. **Modify the template** in `/app/llms.txt/route.ts`
2. **Add new data sources** by creating additional load functions
3. **Change the format** by updating the content template
4. **Add sections** by extending the generation logic

### Example Customization
```typescript
// Add a new section to the llms.txt
const customSection = `
## Awards & Recognition
${awards.map(award => `- ${award.title}: ${award.description}`).join('\n')}
`;
```

## 📝 Best Practices

### Content Quality
- **Keep descriptions concise** but informative
- **Use clear project titles** that explain the purpose
- **Write engaging blog post descriptions**
- **Maintain updated skill lists**

### Configuration
- **Use descriptive site titles** and descriptions
- **Keep contact information current**
- **Ensure social links are valid**
- **Use professional language**

### Performance
- The file is cached for 1 hour
- Content generation is optimized for speed
- Minimal impact on site performance

---

The dynamic `llms.txt` ensures that AI assistants always have access to your most current professional information, making your portfolio more discoverable and useful for automated content understanding. 
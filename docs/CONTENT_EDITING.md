# Content Editing Guide

This guide explains how to manage content for the portfolio website using Decap CMS.

## Accessing the CMS

1. Go to `/admin` on the website
2. Log in with your GitHub account
3. You'll see the CMS dashboard with all content collections

## Content Types

### Profile (`/content/settings/profile.json`)

- Basic information about you
- Supports both Portuguese (pt) and English (en)
- Social media links
- Contact information

### Skills (`/content/data/skills.json`)

- List of technical skills
- Categories: Linguagens, Cloud/Infra, CI/CD, Observabilidade, etc.
- Skill levels: Avançado, Experiente, Proficiente, Familiarizado

### Experience (`/content/experience/*.json`)

- Professional experience entries
- Bilingual titles and responsibilities
- Period and start date
- Company information

### Education (`/content/education/*.json`)

- Educational background
- Bilingual degree names and descriptions
- Institution and period
- Expected completion date

### Certifications (`/content/certifications/*.json`)

- Professional certifications
- Issuing organization
- Date obtained
- Verification URL

### Projects (`/content/projects/*.json`)

- Portfolio projects
- Bilingual titles and descriptions
- Technologies used
- GitHub links
- Featured flag for highlighting

### Blog Posts (`/content/posts/*.md`)

- Technical blog posts
- Bilingual content
- Markdown support
- Tags and categories
- Author information

## Best Practices

1. **Language Support**

   - Always fill in both Portuguese (pt) and English (en) fields
   - Keep translations consistent in tone and content
   - Use appropriate language-specific formatting

2. **Images**

   - Use descriptive file names
   - Optimize images before uploading
   - Maintain consistent aspect ratios
   - Maximum size: 2MB

3. **Markdown**

   - Use proper heading hierarchy (h1 > h2 > h3)
   - Include code blocks with language specification
   - Add alt text to images
   - Use lists and tables for better organization

4. **Content Organization**

   - Use clear, descriptive titles
   - Keep descriptions concise but informative
   - Use appropriate categories and tags
   - Maintain consistent formatting

5. **Workflow**
   - Preview changes before publishing
   - Use the editorial workflow for major changes
   - Check content in both languages
   - Verify all links work correctly

## Publishing Process

1. Make your changes in the CMS
2. Preview the changes using the preview pane
3. Save the draft
4. Request review if needed (editorial workflow)
5. Publish when ready

Changes will automatically:

- Update the website
- Trigger validation tests
- Send notifications to Discord
- Create a Git commit

## Troubleshooting

If you encounter issues:

1. **Preview Not Loading**

   - Check your browser console for errors
   - Try refreshing the page
   - Clear browser cache if needed

2. **Save/Publish Errors**

   - Ensure all required fields are filled
   - Check character limits
   - Verify file sizes for media

3. **Validation Errors**
   - Review the error message
   - Check data format (dates, URLs)
   - Ensure all required translations exist

## Getting Help

- Check the [GitHub repository](https://github.com/caiolombello/portfolio) for technical documentation
- Open an issue for bugs or suggestions
- Contact the development team through Discord

## Content Guidelines

### Writing Style

- Professional and clear
- Consistent voice across entries
- Technical accuracy
- SEO-friendly

### Media Guidelines

- High-quality images
- Consistent aspect ratios
- Proper attribution
- Optimized file sizes

### SEO Best Practices

- Descriptive titles
- Relevant keywords
- Meta descriptions
- Proper heading structure

## Regular Maintenance

- Review and update content monthly
- Check for broken links
- Update outdated information
- Maintain consistent formatting

Remember: All changes are version-controlled and can be reverted if needed.

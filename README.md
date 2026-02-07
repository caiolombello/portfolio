# Modern Portfolio Template

A modern, responsive, and fully configurable portfolio template built with Next.js 16, TypeScript, and Tailwind CSS. Perfect for developers, designers, and professionals who want to showcase their work beautifully.

![Portfolio Preview](public/images/Portfolio.png)

## Features

- **Dark/Light mode** with smooth transitions and WCAG-compliant colors
- **Multilingual** (EN, PT, ES) with automatic content fallbacks
- **File-based CMS** — edit JSON and Markdown, no database needed
- **Blog** with Markdown, syntax highlighting, and RSS feed
- **Project showcase** with images, technologies, and links
- **Resume/CV** with PDF generation (LaTeX) and interactive timeline
- **Company & institution logos** on experience/education items with graceful fallback
- **LinkedIn sync** — optionally pull experience and education data during build
- **Dynamic Open Graph images** per page (blog posts, projects, resume, contact)
- **Credly certifications** displayed automatically from your username
- **SEO optimized** — sitemaps, structured data, meta tags, `metadataBase`
- **Vercel Analytics & Speed Insights** built-in
- **Interactive setup wizard** (`npm run setup`)

## Quick Start

### 1. Fork & Clone

Click **"Use this template"** or **"Fork"** on GitHub, then:

```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
npm install
```

### 2. Run Interactive Setup

```bash
npm run setup
```

This prompts for your name, email, GitHub username, etc. and generates `config/site.json` and `content/profile/profile.json`.

**Or configure manually:**

```bash
cp config/site.json.template config/site.json
cp content/profile/profile.json.template content/profile/profile.json
# Edit both files with your information
```

### 3. Add Your Content

```
content/
├── experience/       # Work experience (JSON)
├── education/        # Education (JSON)
├── projects/         # Portfolio projects (JSON)
├── posts/            # Blog posts (Markdown)
├── skills/           # Skills list (JSON)
├── profile/          # Personal info (JSON)
└── testimonials.json # Testimonials
```

See [CONFIG.md](CONFIG.md) for content file formats and examples.

### 4. Environment Variables (optional)

```bash
cp .env.example .env.local
```

Available integrations: Google Search Console, AWS S3, Vercel Blob, Giscus comments, and LinkedIn sync. All are optional.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## After Forking Checklist

- [ ] Run `npm run setup` or manually create `config/site.json` from the template
- [ ] Update `content/profile/profile.json` with your bio
- [ ] Replace example content in `content/experience/`, `content/projects/`, `content/education/`
- [ ] Update `content/skills/skills.json` with your skills
- [ ] Copy `.env.example` to `.env.local` and configure integrations
- [ ] (Optional) Add your profile photo to `public/images/profile/`
- [ ] (Optional) Add blog posts to `content/posts/`
- [ ] (Optional) Set up LinkedIn sync for automatic experience/education updates
- [ ] (Optional) Update `LICENSE` with your name

## Project Structure

```
portfolio/
├── app/                    # Next.js 16 App Router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages + OG images
│   ├── contact/           # Contact page + OG image
│   ├── portfolio/         # Portfolio pages + OG images
│   └── resume/            # Resume page + OG image
├── components/            # React components
├── config/                # Site configuration
│   ├── site.json          # Main config file
│   └── site.json.template # Template for new users
├── content/               # Your content (JSON/Markdown)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── proxy.ts               # Request proxy (redirects)
├── scripts/               # Build & automation scripts
│   ├── setup.sh           # Interactive setup wizard
│   ├── sync-linkedin.ts   # LinkedIn experience/education sync
│   ├── build-resume.sh    # LaTeX PDF resume builder
│   └── optimize-images.mjs # Image optimization (WebP/AVIF)
├── public/                # Static assets & generated PDFs
└── types/                 # TypeScript definitions
```

## Configuration

### Site Configuration (`config/site.json`)

```json
{
  "site": {
    "name": "Your Portfolio Name",
    "title": "Your Name - Your Profession",
    "shortName": "Your Name",
    "description": "Your professional description...",
    "url": "https://yourdomain.com",
    "author": "Your Full Name",
    "email": "your.email@example.com",
    "location": "Your Location"
  },
  "social": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "twitter": "https://twitter.com/yourusername",
    "website": "https://yourdomain.com"
  },
  "integrations": {
    "credlyUsername": "your-credly-username",
    "twitterHandle": "@yourusername"
  }
}
```

For detailed configuration instructions, see [CONFIG.md](CONFIG.md).

### LinkedIn Sync (optional)

Automatically syncs experience and education data from LinkedIn during build. The script updates metadata (titles, dates, logos, URLs) while preserving your manual content (responsibilities, translations, descriptions).

1. Get your `li_at` cookie from browser DevTools (LinkedIn > Application > Cookies)
2. Add to `.env.local`:
   ```
   LINKEDIN_COOKIE=your-li_at-cookie-value
   LINKEDIN_USERNAME=your-linkedin-username
   ```
3. The sync runs automatically during `npm run build` (prebuild step). It's non-fatal — if the cookie expires or is missing, the build continues with existing data.

You can also run it manually: `npm run sync-linkedin`

## Customization

### Styling
- **Colors**: Edit CSS variables in `app/globals.css` (gold accent uses WCAG AA compliant values)
- **Fonts**: Modify `app/layout.tsx`
- **Components**: Customize in `/components`

### Images
- **Profile**: `public/images/profile/`
- **Projects**: `public/images/projects/`
- **Blog**: `public/images/posts/`

## Build Pipeline

The `prebuild` step runs automatically before `next build`:

1. **Image optimization** — generates WebP and AVIF variants with responsive sizes
2. **Resume generation** — compiles LaTeX templates into PDF (requires Docker or local pdflatex)
3. **LinkedIn sync** — pulls latest experience/education data (optional, non-fatal)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms

Works on any platform that supports Next.js: Netlify, Railway, AWS Amplify, or self-hosted.

## Scripts

```bash
npm run setup           # Interactive setup wizard
npm run dev             # Start dev server (Turbopack)
npm run build           # Build for production (includes prebuild pipeline)
npm run start           # Start production server
npm run lint            # Run ESLint
npm run test            # Run tests (Vitest)
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run analyze         # Bundle analysis
npm run sync-linkedin   # Sync experience/education from LinkedIn
npm run optimize-images # Optimize images (WebP/AVIF)
```

## Internationalization

Built-in support for multiple languages:

- **English (en)**
- **Portuguese (pt)**
- **Spanish (es)**

Language switching via header controls, with automatic content fallbacks.

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Contributing

Contributions are welcome! Whether you're fixing bugs, adding features, or improving documentation.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

- [Configuration Guide](CONFIG.md)
- [Report issues](https://github.com/caiolombello/portfolio/issues)
- [Start a discussion](https://github.com/caiolombello/portfolio/discussions)

---

Give it a star if this template helped you build your portfolio!

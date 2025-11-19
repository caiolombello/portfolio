import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content');
const TEMPLATE_DIR = path.join(__dirname, '../resume-template/templates');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Helper to read JSON
const readJson = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Helper to read all JSONs in a dir
const readJsonDir = (dirPath: string) => {
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  return files.map(f => readJson(path.join(dirPath, f)));
};

// Helper to escape LaTeX special characters
const escapeLatex = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

// Register Handlebars helpers
Handlebars.registerHelper('escapeLatex', function (text) {
  return new Handlebars.SafeString(escapeLatex(text));
});

async function generate() {
  console.log('Starting resume generation...');

  // 1. Load Data
  const profile = readJson(path.join(CONTENT_DIR, 'profile/profile.json'));
  const skillsData = readJson(path.join(CONTENT_DIR, 'skills/skills.json'));
  const experienceData = readJsonDir(path.join(CONTENT_DIR, 'experience'));
  const educationData = readJsonDir(path.join(CONTENT_DIR, 'education'));

  // Sort experience and education by date (descending)
  experienceData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  educationData.sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date();
    const dateB = b.endDate ? new Date(b.endDate) : new Date();
    return dateB.getTime() - dateA.getTime();
  });

  // 2. Prepare Data for Templates
  const languages = ['en', 'pt'];

  for (const lang of languages) {
    const isPt = lang === 'pt';

    const data = {
      name: profile[lang].name,
      title: profile[lang].title,
      location: profile[lang].location,
      email: profile.email,
      phone: profile.phone,
      linkedin: profile.socialLinks.linkedin,
      linkedinUser: profile.socialLinks.linkedin.split('/').pop(),
      github: profile.socialLinks.github,
      githubUser: profile.socialLinks.github.split('/').pop(),
      about: profile[lang].about,

      labels: {
        experience: isPt ? 'Experiência Profissional' : 'Professional Experience',
        skills: isPt ? 'Habilidades' : 'Skills',
        education: isPt ? 'Educação' : 'Education',
        about: isPt ? 'Sobre' : 'About',
      },

      experience: experienceData.map(exp => ({
        company: exp.company,
        title: isPt ? exp.title_pt : exp.title_en,
        period: exp.period,
        location: '', // Not in JSON, maybe add or leave empty
        responsibilities: (isPt ? exp.responsibilities_pt : exp.responsibilities_en).map((r: any) => r.item)
      })),

      education: educationData.map(edu => ({
        institution: edu.institution,
        degree: isPt ? edu.degree_pt : edu.degree_en,
        period: edu.period,
        location: '', // Not in JSON
        description: isPt ? edu.description_pt : edu.description_en
      })),

      skills: skillsData.skills_list.reduce((acc: any[], skill: any) => {
        let category = skill.category;

        // Translate categories for English
        if (!isPt) {
          const categoryTranslations: Record<string, string> = {
            'Containerização': 'Containerization',
            'Linguagens': 'Languages',
            'Observabilidade': 'Observability',
            'Segurança': 'Security',
            'Ferramentas': 'Tools',
            'Automação': 'Automation',
            'Cloud/Infra': 'Cloud/Infra', // Optional: Cloud/Infrastructure
            'CI/CD': 'CI/CD'
          };
          if (categoryTranslations[category]) {
            category = categoryTranslations[category];
          }
        }

        const existing = acc.find(c => c.category === category);
        if (existing) {
          existing.items += `, ${skill.name}`;
        } else {
          acc.push({ category, items: skill.name });
        }
        return acc;
      }, [])
    };

    // 3. Render Templates

    // LaTeX
    const latexTemplatePath = path.join(TEMPLATE_DIR, 'resume.tex.hbs');
    console.log(`Compiling LaTeX template from ${latexTemplatePath}`);
    const latexTemplateSource = fs.readFileSync(latexTemplatePath, 'utf-8');
    console.log(`Template length: ${latexTemplateSource.length}`);
    // We need a separate compile for LaTeX to handle escaping
    const latexTemplate = Handlebars.compile(latexTemplateSource);

    // Deep copy and escape for LaTeX
    const latexData = JSON.parse(JSON.stringify(data));
    // Helper function to recursively escape strings in object
    const escapeObject = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = escapeLatex(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          escapeObject(obj[key]);
        }
      }
    };
    escapeObject(latexData);
    // Restore unescaped links for href
    latexData.linkedin = data.linkedin;
    latexData.github = data.github;
    latexData.email = data.email;

    const latexOutput = latexTemplate(latexData);
    const texFileName = isPt ? 'curriculo.tex' : 'resume.tex';
    fs.writeFileSync(path.join(PUBLIC_DIR, texFileName), latexOutput);
    console.log(`Generated ${texFileName}`);

    // Markdown
    const mdTemplateSource = fs.readFileSync(path.join(TEMPLATE_DIR, 'resume.md.hbs'), 'utf-8');
    const mdTemplate = Handlebars.compile(mdTemplateSource);
    const mdOutput = mdTemplate(data);
    const mdFileName = isPt ? 'curriculo.md' : 'resume.md';
    fs.writeFileSync(path.join(PUBLIC_DIR, mdFileName), mdOutput);
    console.log(`Generated ${mdFileName}`);
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});

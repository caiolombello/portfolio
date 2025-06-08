# Content Structure

This directory contains all the content for the portfolio website, organized in a consistent and intuitive structure.

## 📁 Directory Structure

```
content/
├── profile/                  # Personal information
│   └── profile.json         # Contact, bio, social links
├── skills/                   # Technical skills
│   └── skills.json          # Skills with categories and levels
├── experience/               # Professional experience
│   ├── company-year.json    # Individual job experiences
│   └── ...
├── education/                # Education and certifications
│   ├── institution-year.json # Individual education entries
│   └── ...

├── projects/                 # Portfolio projects
│   ├── project-id.json      # Individual project files
│   └── ...
└── posts/                    # Blog posts
    ├── post-slug.md         # Individual blog posts
    └── ...
```

## 📝 Content Types

### Profile (`/content/profile/profile.json`)
- Personal information with multilingual support (pt/en)
- Contact details and social links
- Professional title and bio

### Skills (`/content/skills/skills.json`)
- Technical skills organized by category
- Skill levels (Beginner, Intermediate, Expert)
- Easy to extend with new skills

### Experience (`/content/experience/`)
- Individual JSON files for each job/position
- Chronological organization
- Responsibilities and achievements

### Education (`/content/education/`)
- Educational background and qualifications
- Individual files for each degree/course
- Institution details and dates

### Certifications (Credly Integration)
- Professional certifications via Credly API
- Automatically fetched and cached for 24 hours
- No manual file management needed

### Projects (`/content/projects/`)
- Portfolio projects with detailed information
- Technologies used, links, and descriptions
- Featured project highlighting

### Posts (`/content/posts/`)
- Blog posts in Markdown format
- Frontmatter with metadata
- Tags and categorization

## 🎯 Benefits of This Structure

- **Consistency**: All content types follow the same pattern
- **Scalability**: Easy to add new content types
- **Maintainability**: Intuitive file locations
- **Separation**: Clear boundaries between different content types
- **Git-friendly**: Each item is a separate file for better version control

## 🔄 Migration Notes

This structure was reorganized from the previous inconsistent layout:
- `content/data/skills.json` → `content/skills/skills.json`
- `content/settings/profile.json` → `content/profile/profile.json`
- All other content types already followed the new pattern

The code has been updated to reference the new paths automatically.

# Sistema de Posts em Markdown

Este diretório contém todos os posts do blog escritos em Markdown puro, sem necessidade do Decap CMS.

## Como criar um novo post

1. Crie um arquivo `.md` nesta pasta com um nome descritivo
2. Adicione o frontmatter YAML no topo do arquivo
3. Escreva seu conteúdo em Markdown
4. Publique!

## Estrutura do Frontmatter

```yaml
---
title_pt: "Título em Português"
title_en: "Title in English"
title_es: "Título en Español"
summary_pt: "Resumo em português"
summary_en: "Summary in English"
summary_es: "Resumen en español"
publicationDate: "2024-01-15"
category: "Categoria"
tags: ["tag1", "tag2", "tag3"]
published: true
coverImage: "https://example.com/image.jpg" # opcional
author:
  name: "Seu Nome"
  avatar: "https://example.com/avatar.jpg" # opcional
---
```

## Campos obrigatórios

- `title_pt`, `title_en`, `title_es`: Títulos nos 3 idiomas
- `summary_pt`, `summary_en`, `summary_es`: Resumos nos 3 idiomas
- `publicationDate`: Data no formato YYYY-MM-DD
- `published`: boolean para controlar se o post aparece

## Campos opcionais

- `category`: Categoria do post
- `tags`: Array de tags
- `coverImage`: URL da imagem de capa
- `author`: Objeto com nome e avatar do autor

## Recursos de Markdown suportados

- **Formatação**: negrito, itálico, ~~riscado~~
- **Links**: [texto](url)
- **Imagens**: ![alt](url)
- **Listas**: numeradas e com marcadores
- **Código**: inline e blocos com syntax highlighting
- **Tabelas**
- **Citações** (blockquotes)
- **Separadores** (---)

## URLs automáticas

O sistema gera automaticamente URLs amigáveis baseadas no título:
- "Meu Post Incrível" → `/blog/meu-post-incrivel`
- Acentos são removidos automaticamente
- Caracteres especiais viram hifens

## Exemplo de arquivo completo

```markdown
---
title_pt: "Como usar React Hooks"
title_en: "How to use React Hooks"
title_es: "Cómo usar React Hooks"
summary_pt: "Guia completo sobre React Hooks"
summary_en: "Complete guide to React Hooks"
summary_es: "Guía completa de React Hooks"
publicationDate: "2024-01-15"
category: "React"
tags: ["react", "hooks", "javascript"]
published: true
---

# Como usar React Hooks

Conteúdo do seu post aqui...
```

## Dicas

1. **Nomes de arquivo**: Use nomes descritivos em kebab-case
2. **Imagens**: Coloque imagens na pasta `public/images/blog/`
3. **Rascunhos**: Use `published: false` para posts não publicados
4. **Datas**: Use o formato ISO (YYYY-MM-DD) para melhor ordenação
5. **Tags**: Use tags consistentes para melhor organização 
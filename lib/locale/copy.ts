import type { Locale } from "@/app/i18n/settings";

/**
 * Interface copy for the site chrome and sections. Personal content (bio,
 * projects, experience) lives in /content; this file only holds UI text.
 */
const pt = {
  locale: "pt-BR",
  ogLocale: "pt_BR",
  nav: {
    home: "Início",
    projects: "Projetos",
    about: "Sobre",
    resume: "Currículo",
    blog: "Blog",
    newsletter: "Newsletter",
    contact: "Contato",
    primary: "Navegação principal",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    skip: "Pular para o conteúdo",
  },
  theme: {
    toggle: "Alternar tema claro/escuro",
  },
  language: {
    label: "Idioma",
    names: { pt: "Português", en: "English", es: "Español" },
  },
  hero: {
    available: "Disponível para novos projetos",
    ctaProjects: "Ver projetos",
    ctaWhatsapp: "Chamar no WhatsApp",
    ctaResume: "Currículo",
    focusFile: "foco.txt",
    projectsDir: "~/projetos",
    since: "em DevOps & SRE desde {date}",
  },
  sections: {
    projects: {
      eyebrow: "01 — Projetos",
      title: "Projetos em destaque",
      description:
        "Ferramentas open source que uso no dia a dia — de gravações com contexto rastreável a cotas de IA na bandeja do Linux — e a infraestrutura por trás delas.",
      viewAll: "Ver todos os projetos",
    },
    about: {
      eyebrow: "02 — Sobre",
      title: "Plataforma, confiabilidade e automação.",
      focusTitle: "Onde eu atuo",
      stackTitle: "Stack principal",
      now: "Agora",
      building: "Construindo",
    },
    experience: {
      eyebrow: "03 — Trajetória",
      title: "Experiência",
      description:
        "Mais de {years} anos construindo e operando plataformas — do estágio à liderança técnica de projetos enterprise.",
      viewResume: "Ver currículo completo",
    },
    testimonials: {
      eyebrow: "04 — Recomendações",
      title: "O que dizem colegas de trabalho",
      linkedin: "Ver no LinkedIn",
    },
    blog: {
      eyebrow: "05 — Blog",
      title: "Escritos técnicos",
      description: "Notas sobre Kubernetes, observabilidade e automação.",
      viewAll: "Ver todos os posts",
    },
  },
  contactCta: {
    eyebrow: "Contato",
    title: "Vamos conversar?",
    description:
      "Tem um desafio de plataforma, nuvem ou observabilidade — ou quer trocar ideia sobre algum projeto? Me chame no WhatsApp ou por e-mail.",
    whatsapp: "Chamar no WhatsApp",
    email: "Enviar e-mail",
    whatsappMessage: "Olá, Caio! Vim pelo seu portfólio.",
  },
  copy: {
    copy: "Copiar",
    copyEmail: "Copiar e-mail",
    copied: "Copiado!",
  },
  projects: {
    title: "Projetos",
    description:
      "O que eu construo e mantenho fora do expediente: ferramentas para quem trabalha com IA, automação em nuvem e o ambiente em que eu trabalho.",
    all: "Todos",
    filterLabel: "Filtrar por categoria",
    empty: "Nenhum projeto nesta categoria.",
    count: "{count} projetos",
    view: "Ver projeto",
    back: "Todos os projetos",
    overview: "Sobre o projeto",
    highlights: "Destaques",
    stack: "Stack",
    details: "Detalhes",
    links: "Links",
    website: "Site do projeto",
    repository: "Código no GitHub",
    privateRepo: "Repositório privado",
    privateNote:
      "O código é privado; os detalhes técnicos estão descritos aqui.",
    year: "Ano",
    status: "Status",
    license: "Licença",
    category: "Categoria",
    more: "Outros projetos",
    statuses: {
      alpha: "Alpha",
      active: "Ativo",
      private: "Privado",
      stable: "Estável",
    } as Record<string, string>,
    categories: {
      "ai-tooling": "Ferramentas para IA",
      "cloud-automation": "Cloud & automação",
      "developer-environment": "Ambiente de desenvolvimento",
      web: "Web",
    } as Record<string, string>,
  },
  resume: {
    title: "Currículo",
    description:
      "Experiência, formação, certificações e stack. Também disponível em PDF.",
    downloadPdf: "Baixar PDF",
    otherLanguagePdf: "PDF em inglês",
    markdown: "Markdown",
    experience: "Experiência",
    education: "Formação",
    certifications: "Certificações",
    skills: "Habilidades",
    present: "atual",
    credlyVerify: "Verificar",
    credlyAll: "Ver perfil no Credly",
    validUntil: "Válida até {date}",
    trainingBadges: "Badges de treinamento selecionados",
    languages: "Idiomas",
    summary: "Resumo profissional",
    completed: "Concluído",
    levels: {
      Avançado: "Avançado",
      Experiente: "Experiente",
      Proficiente: "Proficiente",
      Familiarizado: "Familiarizado",
      Iniciante: "Iniciante",
    } as Record<string, string>,
    skillCategories: {
      "Cloud e infraestrutura": "Cloud e infraestrutura",
      "Containers e IaC": "Containers e IaC",
      "Entrega e plataformas": "Entrega e plataformas",
      Observabilidade: "Observabilidade",
      Segurança: "Segurança",
      Automação: "Automação",
    } as Record<string, string>,
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos conversar",
    description:
      "Projetos, consultoria, oportunidades ou uma boa conversa sobre infraestrutura. Escolha o canal que for melhor para você.",
    whatsapp: "WhatsApp",
    email: "E-mail",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "Localização",
    formTitle: "Envie uma mensagem",
    formDescription:
      "Prefere formulário? A mensagem chega direto no meu e-mail.",
  },
  blog: {
    title: "Blog",
    description:
      "Notas técnicas sobre Kubernetes, observabilidade, automação e o que mais eu estiver estudando.",
    all: "Todos",
    filterLabel: "Filtrar por tag",
    empty: "Nenhum post com essa tag.",
    back: "Voltar para o blog",
    readingTime: "min de leitura",
    previous: "Post anterior",
    next: "Próximo post",
    share: "Compartilhar",
  },
  notFound: {
    title: "Página não encontrada",
    description:
      "O endereço pode ter mudado ou nunca existiu. Que tal voltar ao início ou dar uma olhada nos projetos?",
    home: "Voltar ao início",
    projects: "Ver projetos",
  },
  footer: {
    tagline:
      "Plataformas confiáveis na nuvem — e as ferramentas para operá-las.",
    navigation: "Navegação",
    elsewhere: "Contato",
    builtWith: "Feito com Next.js. Conteúdo em JSON e Markdown.",
    backToTop: "Voltar ao topo",
    rss: "RSS",
  },
  duration: {
    year: "ano",
    years: "anos",
    month: "mês",
    months: "meses",
  },
};

export type Copy = typeof pt;

const en: Copy = {
  locale: "en-US",
  ogLocale: "en_US",
  nav: {
    home: "Home",
    projects: "Projects",
    about: "About",
    resume: "Resume",
    blog: "Blog",
    newsletter: "Newsletter",
    contact: "Contact",
    primary: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skip: "Skip to content",
  },
  theme: {
    toggle: "Toggle light/dark theme",
  },
  language: {
    label: "Language",
    names: { pt: "Português", en: "English", es: "Español" },
  },
  hero: {
    available: "Available for new projects",
    ctaProjects: "View projects",
    ctaWhatsapp: "Message on WhatsApp",
    ctaResume: "Resume",
    focusFile: "focus.txt",
    projectsDir: "~/projects",
    since: "in DevOps & SRE since {date}",
  },
  sections: {
    projects: {
      eyebrow: "01 — Projects",
      title: "Featured projects",
      description:
        "Open-source tools I use every day — from recordings with traceable context to AI quotas in the Linux tray — and the infrastructure behind them.",
      viewAll: "View all projects",
    },
    about: {
      eyebrow: "02 — About",
      title: "Platform, reliability and automation.",
      focusTitle: "What I work on",
      stackTitle: "Core stack",
      now: "Now",
      building: "Building",
    },
    experience: {
      eyebrow: "03 — Career",
      title: "Experience",
      description:
        "Over {years} years building and running platforms — from intern to technical lead on enterprise projects.",
      viewResume: "View full resume",
    },
    testimonials: {
      eyebrow: "04 — Recommendations",
      title: "What colleagues say",
      linkedin: "View on LinkedIn",
    },
    blog: {
      eyebrow: "05 — Blog",
      title: "Technical writing",
      description: "Notes on Kubernetes, observability and automation.",
      viewAll: "View all posts",
    },
  },
  contactCta: {
    eyebrow: "Contact",
    title: "Let's talk?",
    description:
      "Got a platform, cloud or observability challenge — or want to chat about one of the projects? Reach me on WhatsApp or by email.",
    whatsapp: "Message on WhatsApp",
    email: "Send an email",
    whatsappMessage: "Hi Caio! I found you through your portfolio.",
  },
  copy: {
    copy: "Copy",
    copyEmail: "Copy email",
    copied: "Copied!",
  },
  projects: {
    title: "Projects",
    description:
      "What I build and maintain after hours: tools for people who work with AI, cloud automation and the environment I work in.",
    all: "All",
    filterLabel: "Filter by category",
    empty: "No projects in this category.",
    count: "{count} projects",
    view: "View project",
    back: "All projects",
    overview: "About the project",
    highlights: "Highlights",
    stack: "Stack",
    details: "Details",
    links: "Links",
    website: "Project website",
    repository: "Code on GitHub",
    privateRepo: "Private repository",
    privateNote:
      "The code is private; the technical details are described here.",
    year: "Year",
    status: "Status",
    license: "License",
    category: "Category",
    more: "More projects",
    statuses: {
      alpha: "Alpha",
      active: "Active",
      private: "Private",
      stable: "Stable",
    },
    categories: {
      "ai-tooling": "AI tooling",
      "cloud-automation": "Cloud & automation",
      "developer-environment": "Developer environment",
      web: "Web",
    },
  },
  resume: {
    title: "Resume",
    description:
      "Experience, education, certifications and stack. Also available as a PDF.",
    downloadPdf: "Download PDF",
    otherLanguagePdf: "PDF in Portuguese",
    markdown: "Markdown",
    experience: "Experience",
    education: "Education",
    certifications: "Certifications",
    skills: "Skills",
    present: "present",
    credlyVerify: "Verify",
    credlyAll: "View Credly profile",
    validUntil: "Valid until {date}",
    trainingBadges: "Selected training badges",
    languages: "Languages",
    summary: "Professional summary",
    completed: "Completed",
    levels: {
      Avançado: "Advanced",
      Experiente: "Experienced",
      Proficiente: "Proficient",
      Familiarizado: "Familiar",
      Iniciante: "Beginner",
    },
    skillCategories: {
      "Cloud e infraestrutura": "Cloud & infrastructure",
      "Containers e IaC": "Containers & IaC",
      "Entrega e plataformas": "Delivery & platforms",
      Observabilidade: "Observability",
      Segurança: "Security",
      Automação: "Automation",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk",
    description:
      "Projects, consulting, opportunities or a good conversation about infrastructure. Pick whichever channel works best for you.",
    whatsapp: "WhatsApp",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "Location",
    formTitle: "Send a message",
    formDescription: "Prefer a form? Your message goes straight to my inbox.",
  },
  blog: {
    title: "Blog",
    description:
      "Technical notes on Kubernetes, observability, automation and whatever else I'm studying.",
    all: "All",
    filterLabel: "Filter by tag",
    empty: "No posts with this tag.",
    back: "Back to the blog",
    readingTime: "min read",
    previous: "Previous post",
    next: "Next post",
    share: "Share",
  },
  notFound: {
    title: "Page not found",
    description:
      "The address may have changed or never existed. How about going back home or browsing the projects?",
    home: "Back to home",
    projects: "View projects",
  },
  footer: {
    tagline: "Reliable cloud platforms — and the tools to run them.",
    navigation: "Navigation",
    elsewhere: "Contact",
    builtWith: "Built with Next.js. Content in JSON and Markdown.",
    backToTop: "Back to top",
    rss: "RSS",
  },
  duration: {
    year: "yr",
    years: "yrs",
    month: "mo",
    months: "mos",
  },
};

const es: Copy = {
  locale: "es-ES",
  ogLocale: "es_ES",
  nav: {
    home: "Inicio",
    projects: "Proyectos",
    about: "Sobre mí",
    resume: "Currículum",
    blog: "Blog",
    newsletter: "Newsletter",
    contact: "Contacto",
    primary: "Navegación principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    skip: "Saltar al contenido",
  },
  theme: {
    toggle: "Cambiar tema claro/oscuro",
  },
  language: {
    label: "Idioma",
    names: { pt: "Português", en: "English", es: "Español" },
  },
  hero: {
    available: "Disponible para nuevos proyectos",
    ctaProjects: "Ver proyectos",
    ctaWhatsapp: "Escribir por WhatsApp",
    ctaResume: "Currículum",
    focusFile: "foco.txt",
    projectsDir: "~/proyectos",
    since: "en DevOps y SRE desde {date}",
  },
  sections: {
    projects: {
      eyebrow: "01 — Proyectos",
      title: "Proyectos destacados",
      description:
        "Herramientas open source que uso a diario — desde grabaciones con contexto rastreable hasta cuotas de IA en la bandeja de Linux — y la infraestructura detrás de ellas.",
      viewAll: "Ver todos los proyectos",
    },
    about: {
      eyebrow: "02 — Sobre mí",
      title: "Plataforma, confiabilidad y automatización.",
      focusTitle: "En qué trabajo",
      stackTitle: "Stack principal",
      now: "Ahora",
      building: "Construyendo",
    },
    experience: {
      eyebrow: "03 — Trayectoria",
      title: "Experiencia",
      description:
        "Más de {years} años construyendo y operando plataformas — de pasante a líder técnico en proyectos enterprise.",
      viewResume: "Ver currículum completo",
    },
    testimonials: {
      eyebrow: "04 — Recomendaciones",
      title: "Lo que dicen mis colegas",
      linkedin: "Ver en LinkedIn",
    },
    blog: {
      eyebrow: "05 — Blog",
      title: "Escritos técnicos",
      description: "Notas sobre Kubernetes, observabilidad y automatización.",
      viewAll: "Ver todos los posts",
    },
  },
  contactCta: {
    eyebrow: "Contacto",
    title: "¿Hablamos?",
    description:
      "¿Tienes un desafío de plataforma, nube u observabilidad — o quieres conversar sobre algún proyecto? Escríbeme por WhatsApp o por correo.",
    whatsapp: "Escribir por WhatsApp",
    email: "Enviar correo",
    whatsappMessage: "¡Hola, Caio! Vengo de tu portafolio.",
  },
  copy: {
    copy: "Copiar",
    copyEmail: "Copiar correo",
    copied: "¡Copiado!",
  },
  projects: {
    title: "Proyectos",
    description:
      "Lo que construyo y mantengo fuera del horario laboral: herramientas para quien trabaja con IA, automatización en la nube y mi entorno de trabajo.",
    all: "Todos",
    filterLabel: "Filtrar por categoría",
    empty: "No hay proyectos en esta categoría.",
    count: "{count} proyectos",
    view: "Ver proyecto",
    back: "Todos los proyectos",
    overview: "Sobre el proyecto",
    highlights: "Destacados",
    stack: "Stack",
    details: "Detalles",
    links: "Enlaces",
    website: "Sitio del proyecto",
    repository: "Código en GitHub",
    privateRepo: "Repositorio privado",
    privateNote:
      "El código es privado; los detalles técnicos se describen aquí.",
    year: "Año",
    status: "Estado",
    license: "Licencia",
    category: "Categoría",
    more: "Otros proyectos",
    statuses: {
      alpha: "Alpha",
      active: "Activo",
      private: "Privado",
      stable: "Estable",
    },
    categories: {
      "ai-tooling": "Herramientas para IA",
      "cloud-automation": "Nube y automatización",
      "developer-environment": "Entorno de desarrollo",
      web: "Web",
    },
  },
  resume: {
    title: "Currículum",
    description:
      "Experiencia, formación, certificaciones y stack. También disponible en PDF.",
    downloadPdf: "Descargar PDF",
    otherLanguagePdf: "PDF en portugués",
    markdown: "Markdown",
    experience: "Experiencia",
    education: "Formación",
    certifications: "Certificaciones",
    skills: "Habilidades",
    present: "actual",
    credlyVerify: "Verificar",
    credlyAll: "Ver perfil en Credly",
    validUntil: "Válida hasta {date}",
    trainingBadges: "Insignias de formación seleccionadas",
    languages: "Idiomas",
    summary: "Resumen profesional",
    completed: "Concluido",
    levels: {
      Avançado: "Avanzado",
      Experiente: "Experimentado",
      Proficiente: "Competente",
      Familiarizado: "Familiarizado",
      Iniciante: "Principiante",
    },
    skillCategories: {
      "Cloud e infraestrutura": "Nube e infraestructura",
      "Containers e IaC": "Contenedores e IaC",
      "Entrega e plataformas": "Entrega y plataformas",
      Observabilidade: "Observabilidad",
      Segurança: "Seguridad",
      Automação: "Automatización",
    },
  },
  contact: {
    eyebrow: "Contacto",
    title: "Hablemos",
    description:
      "Proyectos, consultoría, oportunidades o una buena conversación sobre infraestructura. Elige el canal que prefieras.",
    whatsapp: "WhatsApp",
    email: "Correo",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "Ubicación",
    formTitle: "Envía un mensaje",
    formDescription:
      "¿Prefieres un formulario? El mensaje llega directo a mi correo.",
  },
  blog: {
    title: "Blog",
    description:
      "Notas técnicas sobre Kubernetes, observabilidad, automatización y lo que esté estudiando.",
    all: "Todos",
    filterLabel: "Filtrar por etiqueta",
    empty: "No hay posts con esta etiqueta.",
    back: "Volver al blog",
    readingTime: "min de lectura",
    previous: "Post anterior",
    next: "Siguiente post",
    share: "Compartir",
  },
  notFound: {
    title: "Página no encontrada",
    description:
      "La dirección puede haber cambiado o nunca existió. ¿Qué tal volver al inicio o ver los proyectos?",
    home: "Volver al inicio",
    projects: "Ver proyectos",
  },
  footer: {
    tagline:
      "Plataformas confiables en la nube — y las herramientas para operarlas.",
    navigation: "Navegación",
    elsewhere: "Contacto",
    builtWith: "Hecho con Next.js. Contenido en JSON y Markdown.",
    backToTop: "Volver arriba",
    rss: "RSS",
  },
  duration: {
    year: "año",
    years: "años",
    month: "mes",
    months: "meses",
  },
};

const copies: Record<Locale, Copy> = { pt, en, es };

export function getCopy(locale: Locale | string | undefined): Copy {
  return copies[(locale as Locale) ?? "pt"] ?? pt;
}

/** Replaces {placeholders} in a copy string. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

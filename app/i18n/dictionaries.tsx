// Definição de tipos para o dicionário
type NestedDictionary = {
  [key: string]: string | NestedDictionary;
};

export type Dictionary = NestedDictionary & {
  resume: {
    title: string;
    description: string;
  };
  blog: {
    title: string;
    description: string;
    back: string;
    readMore: string;
    publishedOn: string;
    tags: string;
    notFound: {
      title: string;
      description: string;
    };
    pagination: {
      previous: string;
      next: string;
      page: string;
    };
    readingTime: string;
    share: string;
    previousPost: string;
    nextPost: string;
  };
  posts: {
    edit: {
      description: string;
    };
  };
};

// Dicionário em português
const pt: Dictionary = {
  // Navegação
  home: "Início",
  about: "Sobre",
  projects: "Projetos",
  blog: {
    title: "Blog",
    description: "Artigos sobre desenvolvimento, DevOps e tecnologia",
    back: "Voltar para o blog",
    readMore: "Ler mais",
    publishedOn: "Publicado em",
    tags: "Tags",
    notFound: {
      title: "Post não encontrado",
      description: "O artigo que você procura não foi encontrado",
    },
    pagination: {
      previous: "Anterior",
      next: "Próximo",
      page: "Página",
    },
    readingTime: "min de leitura",
    share: "Compartilhar",
    previousPost: "Post Anterior",
    nextPost: "Próximo Post",
  },
  contact: "Contato",
  resume: {
    title: "Currículo",
    description: "Currículo profissional com experiência em desenvolvimento Full Stack, DevOps e Cloud Computing.",
  },
  posts: {
    edit: {
      description: "Editar post",
    },
  },

  // Cabeçalho
  greeting: "Olá, eu sou",
  role: "Desenvolvedor Full Stack",

  // Botões
  download_resume: "Baixar Currículo",
  generating: "Gerando...",
  portuguese: "Português",
  english: "Inglês",

  // Seções
  about_me: "Sobre Mim",
  my_projects: "Meus Projotos",
  latest_posts: "Últimos Posts",
  get_in_touch: "Entre em Contato",

  // Formulário de contato
  name: "Nome",
  email: "E-mail",
  message: "Mensagem",
  send: "Enviar",
  sending: "Enviando...",

  // Mensagens
  success_message: "Mensagem enviada com sucesso!",
  error_message: "Ocorreu um erro. Tente novamente.",

  // Footer
  rights_reserved: "Todos os direitos reservados",

  // Outros
  view_project: "Ver Projeto",
  read_more: "Ler Mais",
  back_to_home: "Voltar para o Início",
  loading: "Carregando...",

  // Redes sociais
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  instagram: "Instagram",
  website: "Website",
  whatsapp: "WhatsApp",
};

// Dicionário em inglês
const en: Dictionary = {
  // Navigation
  home: "Home",
  about: "About",
  projects: "Projects",
  blog: {
    title: "Blog",
    description: "Articles about development, DevOps and technology",
    back: "Back to blog",
    readMore: "Read more",
    publishedOn: "Published on",
    tags: "Tags",
    notFound: {
      title: "Post not found",
      description: "The article you're looking for was not found",
    },
    pagination: {
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
    readingTime: "min read",
    share: "Share",
    previousPost: "Previous Post",
    nextPost: "Next Post",
  },
  contact: "Contact",
  resume: {
    title: "Resume",
    description: "Professional resume with experience in Full Stack development, DevOps and Cloud Computing.",
  },
  posts: {
    edit: {
      description: "Edit post",
    },
  },

  // Header
  greeting: "Hello, I'm",
  role: "Full Stack Developer",

  // Buttons
  download_resume: "Download Resume",
  generating: "Generating...",
  portuguese: "Portuguese",
  english: "English",

  // Sections
  about_me: "About Me",
  my_projects: "My Projects",
  latest_posts: "Latest Posts",
  get_in_touch: "Get in Touch",

  // Contact form
  name: "Name",
  email: "Email",
  message: "Message",
  send: "Send",
  sending: "Sending...",

  // Messages
  success_message: "Message sent successfully!",
  error_message: "An error occurred. Please try again.",

  // Footer
  rights_reserved: "All rights reserved",

  // Others
  view_project: "View Project",
  read_more: "Read More",
  back_to_home: "Back to Home",
  loading: "Loading...",

  // Social media
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  instagram: "Instagram",
  website: "Website",
  whatsapp: "WhatsApp",
};

// Dicionário em espanhol
const es: Dictionary = {
  // Navigation
  home: "Inicio",
  about: "Sobre",
  projects: "Proyectos",
  blog: {
    title: "Blog",
    description: "Artículos sobre desarrollo, DevOps y tecnología",
    back: "Volver al blog",
    readMore: "Leer más",
    publishedOn: "Publicado el",
    tags: "Etiquetas",
    notFound: {
      title: "Post no encontrado",
      description: "El artículo que buscas no fue encontrado",
    },
    pagination: {
      previous: "Anterior",
      next: "Siguiente",
      page: "Página",
    },
    readingTime: "min de lectura",
    share: "Compartir",
    previousPost: "Publicación Anterior",
    nextPost: "Siguiente Publicación",
  },
  contact: "Contacto",
  resume: {
    title: "Currículo",
    description: "Currículo profesional con experiencia en desarrollo Full Stack, DevOps y Cloud Computing.",
  },
  posts: {
    edit: {
      description: "Editar post",
    },
  },

  // Header
  greeting: "Hola, soy",
  role: "Desarrollador Full Stack",

  // Buttons
  download_resume: "Descargar Currículo",
  generating: "Generando...",
  portuguese: "Portugués",
  english: "Inglés",

  // Sections
  about_me: "Sobre Mí",
  my_projects: "Mis Proyectos",
  latest_posts: "Últimos Posts",
  get_in_touch: "Ponerse en Contacto",

  // Contact form
  name: "Nombre",
  email: "Correo electrónico",
  message: "Mensaje",
  send: "Enviar",
  sending: "Enviando...",

  // Messages
  success_message: "Mensaje enviado con éxito!",
  error_message: "Ocurrió un error. Inténtalo de nuevo.",

  // Footer
  rights_reserved: "Todos los derechos reservados",

  // Others
  view_project: "Ver Proyecto",
  read_more: "Leer Más",
  back_to_home: "Volver a Inicio",
  loading: "Cargando...",

  // Social media
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  instagram: "Instagram",
  website: "Website",
  whatsapp: "WhatsApp",
};

// Mapeamento de localidade para dicionário
const dictionaries = {
  pt,
  en,
  es,
};

// Função para obter o dicionário com base na localidade
export const getDictionary = (locale: string): Dictionary => {
  return dictionaries[locale as keyof typeof dictionaries] || en;
};

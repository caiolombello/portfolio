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
    title: "Blog | Caio Barbieri",
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
  },
  contact: "Contato",
  resume: {
    title: "Currículo",
    description:
      "Currículo profissional de Caio Barbieri, desenvolvedor Full Stack com experiência em DevOps e Cloud Computing.",
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
  my_projects: "Meus Projetos",
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

  // Admin
  admin_panel: "Painel Administrativo",
  edit_profile: "Editar Perfil",
  edit_projects: "Editar Projetos",
  edit_posts: "Editar Posts",
  logout: "Sair",

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
    title: "Blog | Caio Barbieri",
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
  },
  contact: "Contact",
  resume: {
    title: "Resume | Caio Barbieri",
    description:
      "Professional resume of Caio Barbieri, Full Stack developer with experience in DevOps and Cloud Computing.",
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

  // Admin
  admin_panel: "Admin Panel",
  edit_profile: "Edit Profile",
  edit_projects: "Edit Projects",
  edit_posts: "Edit Posts",
  logout: "Logout",

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
    title: "Blog | Caio Barbieri",
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
  },
  contact: "Contacto",
  resume: {
    title: "Currículo",
    description:
      "Currículo profissional de Caio Barbieri, desenvolvedor Full Stack com experiência em DevOps e Cloud Computing.",
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
  error_message: "Ocurrió un error. Por favor, inténtelo de nuevo.",

  // Footer
  rights_reserved: "Todos los derechos reservados",

  // Admin
  admin_panel: "Panel de Administración",
  edit_profile: "Editar Perfil",
  edit_projects: "Editar Proyectos",
  edit_posts: "Editar Posts",
  logout: "Cerrar Sesión",

  // Outros
  view_project: "Ver Proyecto",
  read_more: "Leer Más",
  back_to_home: "Volver al Inicio",
  loading: "Cargando...",

  // Redes sociales
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  instagram: "Instagram",
  website: "Website",
  whatsapp: "WhatsApp",
};

// Dicionários disponíveis
const dictionaries = {
  pt,
  en,
  es,
};

// Função para obter o dicionário com base no idioma
export const getDictionary = (locale: string): Dictionary => {
  return dictionaries[locale as keyof typeof dictionaries] || dictionaries.pt;
};

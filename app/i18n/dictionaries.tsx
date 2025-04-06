// Definição de tipos para o dicionário
export type Dictionary = {
  [key: string]: string | Dictionary
}

// Dicionário em português
const pt: Dictionary = {
  // Navegação
  home: "Início",
  about: "Sobre",
  projects: "Projetos",
  blog: "Blog",
  contact: "Contato",
  resume: "Currículo",

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
}

// Dicionário em inglês
const en: Dictionary = {
  // Navigation
  home: "Home",
  about: "About",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact",
  resume: "Resume",

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
}

// Dicionários disponíveis
const dictionaries = {
  pt,
  en,
}

// Função para obter o dicionário com base no idioma
export const getDictionary = (locale: string): Dictionary => {
  return dictionaries[locale as keyof typeof dictionaries] || dictionaries.pt
}


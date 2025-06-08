import fs from "fs";
import path from "path";

export interface SiteConfig {
  site: {
    name: string;
    title: string;
    shortName: string;
    description: string;
    url: string;
    author: string;
    email: string;
    phone: string;
    location: string;
    profileImage: string | {
      type: 'local' | 'github' | 'external';
      source: string;
      fallbacks?: {
        type: 'local' | 'github' | 'external';
        source: string;
      }[];
    };
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
  integrations: {
    credlyUsername: string;
    twitterHandle: string;
  };
  seo: {
    keywords: string[];
  };
}

function getDefaultConfig(): SiteConfig {
  return {
    site: {
      name: "Portfolio Template",
      title: "Your Name - Professional Portfolio",
      shortName: "Your Name",
      description: "Professional portfolio and blog showcasing projects, skills and experience",
      url: "https://yoursite.com",
      author: "Your Name",
      email: "your.email@example.com",
      phone: "+1 (555) 123-4567",
      location: "Your City, Country",
      profileImage: "/images/profile/profile.jpg",
    },
    social: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourprofile",
      twitter: "https://twitter.com/yourusername",
      website: "https://yoursite.com",
    },
    integrations: {
      credlyUsername: "your-credly-username",
      twitterHandle: "@yourusername",
    },
    seo: {
      keywords: [
        "your profession",
        "your skills",
        "your location",
        "web development",
        "portfolio"
      ],
    },
  };
}

// Função para carregar configuração do site (apenas para contextos Node.js)
function loadSiteConfigFromFile(): SiteConfig {
  try {
    const configPath = path.join(process.cwd(), "config/site.json");
    if (!fs.existsSync(configPath)) {
      console.warn("Site config not found, using defaults");
      return getDefaultConfig();
    }
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    console.warn("Error loading site config, using defaults:", error);
    return getDefaultConfig();
  }
}

// Cache da configuração para evitar múltiplas leituras
let cachedConfig: SiteConfig | null = null;

// Função principal para obter configuração (contexto Node.js)
export function getSiteConfig(): SiteConfig {
  if (!cachedConfig) {
    cachedConfig = loadSiteConfigFromFile();
  }
  return cachedConfig;
} 
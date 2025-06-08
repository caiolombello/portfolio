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

// Função para carregar configuração via API (compatível com Edge Runtime)
async function loadSiteConfigFromAPI(baseUrl?: string): Promise<SiteConfig> {
  try {
    const url = baseUrl ? `${baseUrl}/api/config/site` : '/api/config/site';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Error loading site config from API, using defaults:", error);
    return getDefaultConfig();
  }
}

// Função para obter configuração em contextos Edge Runtime
export async function getSiteConfigEdge(baseUrl?: string): Promise<SiteConfig> {
  return await loadSiteConfigFromAPI(baseUrl);
} 
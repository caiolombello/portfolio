import { useState, useEffect } from 'react';

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
    profileImage: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
    calendarUrl?: string;
  };
  integrations: {
    credlyUsername: string;
    twitterHandle: string;
  };
  seo: {
    keywords: string[];
  };
  og: {
    strategy: 'static' | 'dynamic';
    image: string;
  };
}

const defaultConfig: SiteConfig = {
  site: {
    name: "Portfolio Template",
    title: "Your Name - Professional Portfolio",
    shortName: "Your Name",
    description: "Professional portfolio and blog showcasing projects, skills and experience",
    url: "https://yoursite.com",
    author: "Your Name",
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    location: "Your City, State/Country",
    profileImage: "/images/profile/profile.jpg"
  },
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
    twitter: "https://twitter.com/yourusername",
    website: "https://yoursite.com",
    calendarUrl: undefined,
  },
  integrations: {
    credlyUsername: "your-credly-username",
    twitterHandle: "@yourusername"
  },
  seo: {
    keywords: [
      "your profession",
      "your skills",
      "your location",
      "web development",
      "portfolio"
    ]
  },
  og: {
    strategy: 'dynamic',
    image: ''
  }
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch('/api/config/site');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (error) {
        console.warn('Failed to load site config, using defaults:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  return { config, loading };
}

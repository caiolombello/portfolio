import { useState, useEffect } from 'react';
import siteJson from '@/config/site.json';

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
    name: siteJson.site.name,
    title: siteJson.site.title,
    shortName: siteJson.site.shortName,
    description: siteJson.site.description,
    url: siteJson.site.url,
    author: siteJson.site.author,
    email: siteJson.site.email,
    phone: siteJson.site.phone,
    location: siteJson.site.location,
    profileImage: (siteJson.site.profileImage as any)?.source
      || String(siteJson.site.profileImage),
  },
  social: {
    github: siteJson.social.github,
    linkedin: siteJson.social.linkedin,
    twitter: siteJson.social.twitter,
    website: siteJson.social.website,
    calendarUrl: siteJson.social.calendarUrl || undefined,
  },
  integrations: {
    credlyUsername: siteJson.integrations.credlyUsername,
    twitterHandle: siteJson.integrations.twitterHandle,
  },
  seo: {
    keywords: siteJson.seo.keywords,
  },
  og: {
    strategy: siteJson.og.strategy as 'static' | 'dynamic',
    image: siteJson.og.image,
  },
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

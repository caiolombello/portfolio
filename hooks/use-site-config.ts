import siteJson from "../config/site.json";

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
  features?: {
    portfolio?: boolean;
  };
  seo: {
    keywords: string[];
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
    profileImage:
      typeof siteJson.site.profileImage === "string"
        ? siteJson.site.profileImage
        : siteJson.site.profileImage.source,
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
  features: {
    portfolio: siteJson.features?.portfolio ?? true,
  },
  seo: {
    keywords: siteJson.seo.keywords,
  },
};

export function useSiteConfig() {
  return { config: defaultConfig, loading: false } as const;
}

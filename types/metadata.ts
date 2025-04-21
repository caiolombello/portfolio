export interface SiteMetadata {
  title: {
    default: string;
    template: string;
  };
  description: string;
  keywords: string[];
  authors: { name: string }[];
  creator: string;
  publisher: string;
  robots: {
    index: boolean;
    follow: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    notranslate?: boolean;
    googleBot?: {
      index: boolean;
      follow: boolean;
      maxSnippet: number;
      maxImagePreview: "none" | "standard" | "large";
      maxVideoPreview: number;
    };
  };
  openGraph: {
    type: string;
    locale: string;
    url: string;
    title: string;
    description: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: "summary" | "summary_large_image" | "app" | "player";
    title: string;
    description: string;
    images: string[];
    creator: string;
  };
  verification: {
    google?: string;
    yandex?: string;
    yahoo?: string;
    other: Record<string, string>;
  };
  alternates: {
    canonical: string;
    languages: Record<string, string>;
  };
  category: string;
}

export const defaultMetadata: SiteMetadata = {
  title: {
    default: "Caio Barbieri",
    template: "%s | Caio Barbieri",
  },
  description: "Portfolio pessoal de Caio Barbieri",
  keywords: [
    "DevOps",
    "Cloud",
    "Kubernetes",
    "Docker",
    "AWS",
    "CI/CD",
    "Infraestrutura",
    "Software",
    "Engenharia",
  ],
  authors: [{ name: "Caio Lombello Vendramini Barbieri" }],
  creator: "Caio Lombello Vendramini Barbieri",
  publisher: "Caio Lombello Vendramini Barbieri",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://caio.lombello.com",
    title: "Caio Barbieri",
    description: "Portfolio pessoal de Caio Barbieri",
    siteName: "Caio Barbieri",
    images: [
      {
        url: "https://caio.lombello.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Caio Barbieri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caio Barbieri",
    description: "Portfolio pessoal de Caio Barbieri",
    images: ["https://caio.lombello.com/og-image.jpg"],
    creator: "@caiolombello",
  },
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
    other: {},
  },
  alternates: {
    canonical: "https://caio.lombello.com",
    languages: {
      "pt-BR": "https://caio.lombello.com",
      "en-US": "https://caio.lombello.com/en",
    },
  },
  category: "technology",
};

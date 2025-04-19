export interface SiteMetadata {
  title: {
    default: string
    template: string
  }
  description: string
  keywords: string[]
  authors: string[]
  creator: string
  publisher: string
  robots: {
    index: boolean
    follow: boolean
    googleBot: {
      index: boolean
      follow: boolean
      maxVideoPreview: number
      maxImagePreview: "none" | "standard" | "large"
      maxSnippet: number
    }
  }
  openGraph: {
    title: string
    description: string
    siteName: string
    locale: string
    type: string
    url: string
    images: {
      url: string
      width: number
      height: number
      alt: string
    }[]
  }
  twitter: {
    card: "summary" | "summary_large_image" | "app" | "player"
    creator: string
    description: string
    images: {
      url: string
      width: number
      height: number
      alt: string
    }[]
  }
  verification: {
    google: string
    yandex: string
    yahoo: string
    other: Record<string, string>
  }
  themeColor: string
  colorScheme: "light" | "dark" | "system"
  generator: string
  links: {
    website: string
    email: string
    github: string
    gitlab: string
    linkedin: string
    twitter: string
    stackoverflow?: string
    devto?: string
    medium?: string
    hashnode?: string
    behance?: string
    dribbble?: string
    figma?: string
    credly?: string
    microsoftLearn?: string
    awsTraining?: string
    whatsapp?: string
    telegram?: string
  }
}

export const defaultMetadata: SiteMetadata = {
  title: {
    default: "Caio Lombello Vendramini Barbieri - DevOps & Cloud Engineer",
    template: "%s | Caio Lombello Vendramini Barbieri",
  },
  description:
    "Portfólio profissional de Caio Lombello Vendramini Barbieri, especialista em DevOps, Cloud Computing e Engenharia de Software. Experiência em automação, infraestrutura como código e desenvolvimento de software.",
  keywords: [
    "devops",
    "cloud",
    "software",
    "engineering",
    "automation",
    "infrastructure",
    "code",
    "development",
    "portfolio",
    "caio",
    "lombello",
    "barbieri",
  ],
  authors: ["Caio Lombello Vendramini Barbieri"],
  creator: "Caio Lombello Vendramini Barbieri",
  publisher: "Caio Lombello Vendramini Barbieri",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxVideoPreview: -1,
      maxImagePreview: "large",
      maxSnippet: -1,
    },
  },
  openGraph: {
    title: "Caio Lombello Vendramini Barbieri - DevOps & Cloud Engineer",
    description:
      "Portfólio profissional de Caio Lombello Vendramini Barbieri, especialista em DevOps, Cloud Computing e Engenharia de Software.",
    siteName: "Caio Lombello Vendramini Barbieri",
    locale: "pt_BR",
    type: "website",
    url: "https://caio.lombello.com",
    images: [
      {
        url: "https://caio.lombello.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Caio Lombello Vendramini Barbieri - DevOps & Cloud Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@caiolombello",
    description:
      "Portfólio profissional de Caio Lombello Vendramini Barbieri, especialista em DevOps, Cloud Computing e Engenharia de Software.",
    images: [
      {
        url: "https://caio.lombello.com/twitter-image.jpg",
        width: 1200,
        height: 630,
        alt: "Caio Lombello Vendramini Barbieri - DevOps & Cloud Engineer",
      },
    ],
  },
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
    other: {},
  },
  themeColor: "#121212",
  colorScheme: "dark",
  generator: "Next.js",
  links: {
    website: "https://caio.lombello.com",
    email: "caio@lombello.com",
    github: "https://github.com/caiolombello",
    gitlab: "https://gitlab.com/caiolombello",
    linkedin: "https://linkedin.com/in/caiolvbarbieri",
    twitter: "https://twitter.com/caiolombello",
  },
}


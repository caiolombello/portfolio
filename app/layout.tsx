import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import DynamicTitle from "@/components/dynamic-title"
import { getBlob } from "@/lib/blob-storage"

const inter = Inter({ subsets: ["latin"] })

async function getSiteSettings() {
  try {
    const settings = await getBlob("settings.json")
    if (!settings) {
      return {
        siteName: "Caio Lombello",
        baseUrl: "https://caio.lombello.com",
        contactEmail: "caio@lombello.com",
        socialLinks: {
          github: "https://github.com/caiolombello",
          linkedin: "https://linkedin.com/in/caiolombello",
          twitter: "https://x.com/caiolombello",
        },
      }
    }
    return JSON.parse(settings)
  } catch (error) {
    console.error("Erro ao carregar configurações:", error)
    return {
      siteName: "Caio Lombello",
      baseUrl: "https://caio.lombello.com",
      contactEmail: "caio@lombello.com",
      socialLinks: {
        github: "https://github.com/caiolombello",
        linkedin: "https://linkedin.com/in/caiolombello",
        twitter: "https://x.com/caiolombello",
      },
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const seoSettings = await getBlob("seo.json")

  let metadata: Metadata = {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: "Portfólio de Caio Lombello, DevOps & Cloud Engineer",
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
    authors: [{ name: "Caio Barbieri" }],
    creator: "Caio Barbieri",
    publisher: "Caio Barbieri",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: settings.baseUrl,
      title: settings.siteName,
      description: "Portfólio de Caio Barbieri, DevOps & Cloud Engineer",
      siteName: settings.siteName,
      images: [
        {
          url: `${settings.baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: "Portfólio de Caio Barbieri, DevOps & Cloud Engineer",
      images: [`${settings.baseUrl}/og-image.jpg`],
      creator: "@caiolombello",
    },
    verification: {
      google: "google-site-verification-code",
      yandex: "yandex-verification-code",
      yahoo: "yahoo-verification-code",
    },
    alternates: {
      canonical: settings.baseUrl,
      languages: {
        "pt-BR": settings.baseUrl,
        "en-US": `${settings.baseUrl}/en`,
      },
    },
    category: "technology",
    themeColor: "#121212",
    colorScheme: "dark",
    generator: "Next.js",
  }

  if (seoSettings) {
    try {
      const seo = JSON.parse(seoSettings)
      metadata = {
        ...metadata,
        ...seo,
      }
    } catch (error) {
      console.error("Erro ao carregar configurações de SEO:", error)
    }
  }

  return metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content="#121212" />
        <meta name="theme-color" content="#121212" />
        <link rel="icon" href="/api/favicon?format=ico" type="image/x-icon" />
        <link rel="icon" href="/api/favicon?size=16" type="image/png" sizes="16x16" />
        <link rel="icon" href="/api/favicon?size=32" type="image/png" sizes="32x32" />
        <link rel="icon" href="/api/favicon?size=48" type="image/png" sizes="48x48" />
        <link rel="icon" href="/api/favicon?size=64" type="image/png" sizes="64x64" />
        <link rel="icon" href="/api/favicon?size=96" type="image/png" sizes="96x96" />
        <link rel="icon" href="/api/favicon?size=128" type="image/png" sizes="128x128" />
        <link rel="icon" href="/api/favicon?size=192" type="image/png" sizes="192x192" />
        <link rel="icon" href="/api/favicon?size=256" type="image/png" sizes="256x256" />
        <link rel="icon" href="/api/favicon?size=384" type="image/png" sizes="384x384" />
        <link rel="icon" href="/api/favicon?size=512" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/api/favicon?size=180" type="image/png" sizes="180x180" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Caio Lombello" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://caio.lombello.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Caio Barbieri",
              url: "https://caio.lombello.com",
              sameAs: [
                "https://github.com/caiolombello",
                "https://linkedin.com/in/caiolombello",
                "https://x.com/caiolombello",
              ],
              jobTitle: "DevOps & Cloud Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Freelancer",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <DynamicTitle />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <ScrollToTop />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
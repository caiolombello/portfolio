import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";
import DynamicTitle from "@/components/dynamic-title";
import { Analytics } from "@/components/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Função para obter configurações do site apenas de dados locais ou valores padrão
async function getSiteSettings() {
  // Aqui você pode ler de um arquivo local se quiser, por exemplo:
  // const settingsPath = path.join(process.cwd(), "public/data/settings.json")
  // if (fs.existsSync(settingsPath)) { ... }
  // Por enquanto, retorna valores padrão:
  return {
    siteName: "Caio Lombello Vendramini Barbieri",
    baseUrl: "https://caio.lombello.com",
    contactEmail: "caio@lombello.com",
    socialLinks: {
      github: "https://github.com/caiolombello",
      linkedin: "https://linkedin.com/in/caiolvbarbieri",
      twitter: "https://twitter.com/caiolombello",
    },
  };
}

export const viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://caio.lombello.com"),
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
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://caio.lombello.com",
    languages: {
      "pt-BR": "https://caio.lombello.com",
      "en-US": "https://caio.lombello.com",
    },
  },
  category: "technology",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content="#121212" />
        <meta name="theme-color" content="#121212" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Caio Barbieri" />
        <link rel="canonical" href="https://caio.lombello.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Caio Lombello Vendramini Barbieri",
              url: "https://caio.lombello.com",
              sameAs: [
                "https://github.com/caiolombello",
                "https://linkedin.com/in/caiolvbarbieri",
                "https://twitter.com/caiolombello",
              ],
              jobTitle: "DevOps & Cloud Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Freelancer",
              },
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import "./globals.css";

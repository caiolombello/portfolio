import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { generateJsonLd, generateSiteMetadata, generateStructuredData, getSiteConfig } from "@/lib/site-metadata";
import { SkipLink } from "@/components/ui/skip-link";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import { getProfileData } from "@/lib/data";
import { ProfileProvider } from "@/contexts/profile-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  themeColor: "#0d1117",
  colorScheme: "dark",
};

// Gerar metadata dinamicamente
export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata(await getCurrentRequestLocale());
}

interface RootLayoutProps {
  children: React.ReactNode;
}

import { getDictionary } from "@/app/i18n";

export default async function RootLayout({ children }: RootLayoutProps) {
  const config = getSiteConfig();
  const profile = await getProfileData();
  const structuredData = await generateStructuredData(profile);

  const lang = await getCurrentRequestLocale();
  const initialDictionary = await getDictionary(lang);

  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content="#0d1117" />
        <meta name="theme-color" content="#0d1117" />
        <link rel="apple-touch-icon" sizes="180x180" href="/api/favicon?size=180&format=png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/api/favicon?size=32&format=png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/api/favicon?size=16&format=png" />
        <link rel="shortcut icon" href="/api/favicon?format=ico" type="image/x-icon" />
        <link rel="icon" href="/api/favicon?size=192&format=png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/api/favicon?size=96&format=png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/api/favicon?size=48&format=png" sizes="48x48" type="image/png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={config.site.shortName} />
        <link rel="alternate" type="application/rss+xml" title={`${config.site.shortName} - RSS Feed`} href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateJsonLd(structuredData)}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialDictionary={initialDictionary} initialLanguage={lang}>
            <ProfileProvider profile={profile}>
              <div className="flex min-h-screen flex-col">
                <SkipLink
                  contentId="main-content"
                  label={lang === "en" ? "Skip to main content" : "Pular para o conteúdo principal"}
                />
                <Navbar />
                <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
                  {children}
                </main>
                <Footer />
                <ScrollToTop />
              </div>
              <Toaster />
            </ProfileProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

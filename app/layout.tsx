import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import DynamicTitle from "@/components/dynamic-title";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { generateSiteMetadata, generateStructuredData, getSiteConfig } from "@/lib/site-metadata";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

// Gerar metadata dinamicamente
export const metadata: Metadata = generateSiteMetadata();

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const config = getSiteConfig();
  const structuredData = generateStructuredData();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content="#121212" />
        <meta name="theme-color" content="#121212" />
        <link rel="apple-touch-icon" sizes="180x180" href="/api/favicon?size=180&format=png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/api/favicon?size=32&format=png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/api/favicon?size=16&format=png" />
        <link rel="manifest" href="/api/webmanifest" />
        <link rel="shortcut icon" href="/api/favicon?format=ico" type="image/x-icon" />
        <link rel="icon" href="/api/favicon?size=192&format=png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/api/favicon?size=96&format=png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/api/favicon?size=48&format=png" sizes="48x48" type="image/png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={config.site.shortName} />
        <link rel="canonical" href={config.site.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
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
            <DynamicTitle />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <ScrollToTop />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import "./globals.css";

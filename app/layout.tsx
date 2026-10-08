import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { cn } from "@/lib/utils";
import {
  generateJsonLd,
  generateSiteMetadata,
  generateStructuredData,
  getSiteConfig,
} from "@/lib/site-metadata";
import { getDictionary } from "@/app/i18n";
import { getCurrentRequestLocale as getLocale } from "@/lib/request-locale-server";
import { getProfileData } from "@/lib/data";
import { ProfileProvider } from "@/contexts/profile-context";
import { getCopy } from "@/lib/locale/copy";
import { getPerson } from "@/lib/site-data";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
  colorScheme: "light dark",
};

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata(await getLocale());
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const locale = await getLocale();
  const profile = await getProfileData();
  const [dictionary, person, structuredData] = await Promise.all([
    getDictionary(locale),
    getPerson(locale),
    generateStructuredData(profile),
  ]);
  const copy = getCopy(locale);
  const role = person.role;

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(sans.variable, mono.variable, serif.variable)}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/api/favicon?size=180&format=png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/api/favicon?size=32&format=png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/api/favicon?size=16&format=png"
        />
        <link
          rel="icon"
          href="/api/favicon?size=192&format=png"
          sizes="192x192"
          type="image/png"
        />
        <link
          rel="shortcut icon"
          href="/api/favicon?format=ico"
          type="image/x-icon"
        />
        <link rel="manifest" href="/api/webmanifest" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${config.site.shortName} — RSS`}
          href="/feed.xml"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta
          name="apple-mobile-web-app-title"
          content={config.site.shortName}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateJsonLd(structuredData)}
        />
      </head>
      <body
        id="top"
        className="min-h-screen bg-background font-sans antialiased"
      >
        <a
          href="#conteudo"
          className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg transition-transform focus:translate-y-0"
        >
          {copy.nav.skip}
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider
            initialDictionary={dictionary}
            initialLanguage={locale}
          >
            <ProfileProvider profile={profile}>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader
                  name={person.name}
                  role={role}
                  photo={person.photo}
                />
                <main
                  id="conteudo"
                  className="flex-1 focus:outline-none"
                  tabIndex={-1}
                >
                  {children}
                </main>
                <SiteFooter locale={locale} person={person} role={role} />
              </div>
            </ProfileProvider>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

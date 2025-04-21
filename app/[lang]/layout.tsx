import { Metadata } from "next";
import { DevToolbar } from "@/components/dev/toolbar";
import { ThemeProvider } from "@/components/theme-provider";
import { MetadataManager } from "@/components/metadata-manager";
import { generateSeoMetadata } from "@/lib/seo";
import { generatePersonSchema, generateWebSiteSchema } from "@/lib/schema";
import { getDictionary, Lang } from "@/lib/i18n";

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Lang };
}): Promise<Metadata> {
  const dict = await getDictionary(lang);
  const profile = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/public/profile`,
  ).then((res) => res.json());

  return generateSeoMetadata({
    title: `${profile[lang].name} - ${profile[lang].title}`,
    description: profile[lang].about,
    keywords: [
      "developer",
      "portfolio",
      "software engineer",
      ...profile.skills,
    ],
    ogImage: profile.imageUrl,
    ogType: "website",
    twitterCard: "summary_large_image",
    alternates: {
      languages: {
        en: "/en",
        pt: "/pt",
        es: "/es",
      },
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}`,
    },
  });
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const profile = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/public/profile`,
  ).then((res) => res.json());

  const personSchema = generatePersonSchema({
    name: profile[lang].name,
    description: profile[lang].about,
    image: profile.imageUrl,
    jobTitle: profile[lang].title,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: [
      profile.socialLinks?.github,
      profile.socialLinks?.linkedin,
      profile.socialLinks?.twitter,
    ].filter(Boolean),
    email: profile.email,
    telephone: profile.phone,
    address: {
      addressLocality: profile.location,
      addressCountry: "Brazil",
    },
  });

  const websiteSchema = generateWebSiteSchema({
    name: `${profile[lang].name} - Portfolio`,
    description: profile[lang].about,
    url: process.env.NEXT_PUBLIC_SITE_URL!,
    author: personSchema,
    inLanguage: lang,
    keywords: profile.skills,
  });

  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MetadataManager structuredData={[personSchema, websiteSchema]} />
          {children}
          <DevToolbar />
        </ThemeProvider>
      </body>
    </html>
  );
}

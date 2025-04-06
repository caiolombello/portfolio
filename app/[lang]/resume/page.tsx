import { getDictionary } from "@/app/i18n/dictionaries"
import type { Metadata } from "next"
import ResumeContent from "@/components/resume/resume-content"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: `${dict.resume.title} | Portfolio`,
    description: `${dict.resume.title} - Professional experience, education, and skills`,
  }
}

export default async function ResumePage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{dict.resume.title}</h1>
      <ResumeContent lang={params.lang} />
    </main>
  )
}


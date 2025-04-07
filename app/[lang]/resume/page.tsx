import { Metadata } from 'next'
import { getDictionary } from '@/app/i18n/dictionaries'
import ResumeContent from '@/components/resume/resume-content'

type PageProps = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return {
    title: dict.resume.title,
    description: dict.resume.description,
  }
}

export default async function ResumePage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="container mx-auto py-8">
      <ResumeContent lang={lang} />
    </div>
  )
}


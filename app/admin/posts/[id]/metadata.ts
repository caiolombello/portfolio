import { Metadata } from 'next'
import { getDictionary } from '@/app/i18n/dictionaries'

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary('en')

  return {
    title: `Edit Post ${params.id} | Portfolio`,
    description: `Edit post ${params.id} - ${dict.posts.edit.description}`,
  }
} 
import axios from 'axios';

// Substitua pelo seu nome de usuário do Medium
const MEDIUM_USERNAME = 'caiolombello';

// A API pública do Medium para RSS feed do usuário
const MEDIUM_RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;

interface MediumPost {
  id: string;
  title: string;
  description: string;
  content: string;
  link: string;
  author: string;
  published: string;
  thumbnail: string;
  categories: string[];
}

// Função para converter RSS para JSON usando a API do rss2json
export async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${MEDIUM_RSS_URL}`);
    
    if (response.data.status === 'ok') {
      const posts = response.data.items.map((item: any) => ({
        id: item.guid,
        title: item.title,
        description: item.description,
        content: item.content,
        link: item.link,
        author: item.author,
        published: item.pubDate,
        thumbnail: item.thumbnail,
        categories: item.categories,
      }));

      return posts;
    }
    
    throw new Error('Failed to fetch Medium posts');
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    throw error;
  }
}

// Função para buscar um post específico
export async function getMediumPost(id: string): Promise<MediumPost | undefined> {
  const posts = await getMediumPosts();
  return posts.find((post: MediumPost) => post.id === id);
} 
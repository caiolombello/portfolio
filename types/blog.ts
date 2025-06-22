export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  name: string;
  avatar?: string;
  url?: string;
}

export interface Post {
  slug_pt: string;
  slug_en: string;
  title_pt: string;
  title_en: string;
  title_es?: string;
  summary_pt: string;
  summary_en: string;
  summary_es?: string;
  body_pt: string;
  body_en: string;
  body_es?: string;
  coverImage?: string;
  publicationDate: string;
  author?: Author;
  category?: string;
  tags?: string[];
  published?: boolean;
}

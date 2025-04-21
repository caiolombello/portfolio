export interface Technology {
  tech: string;
}

export interface Project {
  id: string;
  title_pt: string;
  title_en: string;
  shortDescription_pt: string;
  shortDescription_en: string;
  description_pt: string;
  description_en: string;
  imageUrl?: string;
  category?: string;
  technologies?: Technology[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

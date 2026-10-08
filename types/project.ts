export interface Technology {
  tech: string;
}

export interface ProjectCaseStudy {
  role_pt?: string;
  role_en?: string;
  challenge_pt?: string;
  challenge_en?: string;
  approach_pt?: string;
  approach_en?: string;
  outcomes_pt?: string[];
  outcomes_en?: string[];
}

export interface Project {
  id: string;
  title_pt: string;
  title_en: string;
  shortDescription_pt: string;
  shortDescription_en: string;
  description_pt: string;
  description_en: string;
  tagline_pt?: string;
  tagline_en?: string;
  highlights_pt?: string[];
  highlights_en?: string[];
  status?: string;
  year?: number;
  license?: string;
  order?: number;
  imageUrl?: string;
  category?: string;
  technologies?: Technology[];
  githubUrl?: string;
  liveUrl?: string;
  liveUrl_pt?: string;
  liveUrl_en?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  caseStudy?: ProjectCaseStudy;
}

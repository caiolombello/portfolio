export * from "./profile";
export * from "./skill";
export * from "./experience";
export * from "./education";
export * from "./certification";
export * from "./project";
export * from "./blog";

export interface Author {
  name: string;
  avatar?: string;
}

export interface Post {
  slug: string;
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

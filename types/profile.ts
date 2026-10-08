export interface ProfileLocale {
  name: string;
  title: string;
  role?: string;
  headline?: string[];
  intro?: string;
  focus?: { icon: string; title: string; description: string }[];
  location?: string;
  birthDate?: string;
  about: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  whatsapp?: string;
}

export interface Profile {
  pt: ProfileLocale;
  en: ProfileLocale;
  es?: ProfileLocale;
  email: string;
  phone?: string;
  avatar?: string;
  socialLinks?: SocialLinks;
  languages?: {
    name_pt: string;
    name_en: string;
    level_pt: string;
    level_en: string;
  }[];
}

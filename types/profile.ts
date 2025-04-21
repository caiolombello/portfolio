export interface ProfileLocale {
  name: string;
  title: string;
  location?: string;
  birthDate?: string;
  about: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface Profile {
  pt: ProfileLocale;
  en: ProfileLocale;
  email: string;
  phone?: string;
  avatar?: string;
  socialLinks?: SocialLinks;
}

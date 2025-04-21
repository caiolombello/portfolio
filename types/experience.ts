export interface ResponsibilityItem {
  item: string;
}

export interface Experience {
  company: string;
  title_pt: string;
  title_en: string;
  title_es?: string;
  period: string;
  responsibilities_pt: ResponsibilityItem[];
  responsibilities_en: ResponsibilityItem[];
  responsibilities_es?: ResponsibilityItem[];
  startDate?: string;
}

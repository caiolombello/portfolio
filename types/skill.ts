export type SkillCategory =
  | "Linguagens"
  | "Cloud/Infra"
  | "CI/CD"
  | "Observabilidade"
  | "Containerização"
  | "Segurança"
  | "Automação"
  | "Frontend"
  | "Backend"
  | "Banco de Dados"
  | "Ferramentas"
  | "Outros";

export type SkillLevel =
  | "Avançado"
  | "Experiente"
  | "Proficiente"
  | "Familiarizado"
  | "Iniciante";

export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export interface SkillsData {
  skills_list: Skill[];
}

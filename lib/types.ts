import { z } from "zod";
import {
  PostSchema,
  ProfileSchema,
  SkillSchema,
  ExperienceSchema,
  EducationSchema,
  CertificationSchema,
  ProjectSchema,
} from "./validation";

// Export types inferred from schemas
export type Profile = z.infer<typeof ProfileSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Post = z.infer<typeof PostSchema>;

// Additional type definitions
export interface Author {
  name: string;
  avatar?: string;
}

// Re-export schemas for validation
export {
  ProfileSchema,
  SkillSchema,
  ExperienceSchema,
  EducationSchema,
  CertificationSchema,
  ProjectSchema,
  PostSchema,
};

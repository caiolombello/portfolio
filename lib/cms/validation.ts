import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  image: z.string().url(),
  technologies: z.array(z.string()),
  featured: z.boolean().default(false),
  github: z.string().url().optional(),
  url: z.string().url().optional(),
  publishedAt: z.coerce.date(),
  locale: z.enum(["en", "pt", "es"]),
  seo: z
    .object({
      title: z.string().min(10).max(60).optional(),
      description: z.string().min(50).max(160).optional(),
      keywords: z.array(z.string()).max(10).optional(),
      ogImage: z.string().url().optional(),
    })
    .optional(),
});

export const BlogPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(100),
  excerpt: z.string().min(50).max(160),
  coverImage: z.string().url(),
  publishedAt: z.coerce.date(),
  author: z.string(),
  tags: z.array(z.string()),
  locale: z.enum(["en", "pt", "es"]),
  seo: z
    .object({
      title: z.string().min(10).max(60).optional(),
      description: z.string().min(50).max(160).optional(),
      keywords: z.array(z.string()).max(10).optional(),
      ogImage: z.string().url().optional(),
    })
    .optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;

export async function validateContent(collection: string, data: unknown) {
  const schemas = {
    projects: ProjectSchema,
    posts: BlogPostSchema,
  } as const;

  const schema = schemas[collection as keyof typeof schemas];
  if (!schema) {
    throw new Error(`No schema found for collection: ${collection}`);
  }

  return schema.parse(data);
}

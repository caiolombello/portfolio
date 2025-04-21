import { Post } from "@/types";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const filePath = path.join(postsDirectory, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(fileContent);

        const slug = file.replace(/\.md$/, "");

        return {
          slug,
          slug_pt: `${slug}-pt`,
          slug_en: `${slug}-en`,
          title_pt: data.title_pt,
          title_en: data.title_en,
          title_es: data.title_es || "",
          summary_pt: data.summary_pt,
          summary_en: data.summary_en,
          summary_es: data.summary_es || "",
          body_pt: data.body_pt,
          body_en: data.body_en,
          body_es: data.body_es || "",
          coverImage: data.imageUrl,
          publicationDate: data.publicationDate,
          author: {
            name: data.author.name,
            picture: data.author.avatar,
          },
          category: data.category,
          tags: data.tags,
          published: data.published,
        };
      }),
  );

  return posts.sort(
    (a, b) =>
      new Date(b.publicationDate).getTime() -
      new Date(a.publicationDate).getTime(),
  );
}

import { describe, expect, it } from "vitest";

import { getLocalizedPost } from "./blog-post";
import type { Post } from "@/types/blog";

const post: Post = {
  body_en: "English body",
  body_pt: "Corpo em português",
  category_en: "Reliability",
  category_pt: "Confiabilidade",
  publicationDate: "2026-08-01",
  slug_en: "reliability.en",
  slug_pt: "confiabilidade.pt",
  summary_en: "English summary",
  summary_pt: "Resumo em português",
  tags: ["fallback"],
  tags_en: ["Reliability"],
  tags_pt: ["Confiabilidade"],
  title_en: "Reliable platforms",
  title_pt: "Plataformas confiáveis",
};

describe("getLocalizedPost", () => {
  it("selects all English editorial fields together", () => {
    expect(getLocalizedPost(post, "en")).toEqual({
      body: "English body",
      category: "Reliability",
      slug: "reliability.en",
      summary: "English summary",
      tags: ["Reliability"],
      title: "Reliable platforms",
    });
  });
});

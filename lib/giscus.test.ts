import { describe, expect, it } from "vitest";

import { buildGiscusAttributes } from "./giscus";

describe("buildGiscusAttributes", () => {
  it("builds the exact repository configuration", () => {
    expect(
      buildGiscusAttributes(
        {
          repo: "caiolombello/portfolio",
          repoId: "R_kgDOOVDjYQ",
          category: "Announcements",
          categoryId: "DIC_kwDOOVDjYc4DCdHi",
        },
        "pt",
        "dark",
      ),
    ).toMatchObject({
      "data-category": "Announcements",
      "data-category-id": "DIC_kwDOOVDjYc4DCdHi",
      "data-input-position": "top",
      "data-lang": "pt",
      "data-loading": "lazy",
      "data-mapping": "pathname",
      "data-repo": "caiolombello/portfolio",
      "data-repo-id": "R_kgDOOVDjYQ",
      "data-strict": "1",
      "data-theme": "dark",
    });
  });

  it("rejects incomplete or malformed configuration", () => {
    expect(
      buildGiscusAttributes(
        { repo: "invalid", repoId: "id", category: "Announcements" },
        "en",
        "light",
      ),
    ).toBeNull();
  });
});

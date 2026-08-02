// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BlogStats } from "./blog-stats";

vi.mock("@/contexts/language-context", () => ({
  useLanguage: () => ({ language: "pt" }),
}));

describe("BlogStats", () => {
  it("uses the singular form for one article", () => {
    const { container } = render(
      <BlogStats filteredPosts={1} isFiltered={false} totalPosts={1} />,
    );

    expect(container.textContent).toContain("1 artigo no total");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import MarkdownRenderer from "./markdown-renderer";

describe("MarkdownRenderer", () => {
  it("does not render executable HTML from Markdown", () => {
    const html = renderToStaticMarkup(
      <MarkdownRenderer
        content={'<img src="x" onerror="alert(1)">\n<script>alert(2)</script>'}
      />,
    );

    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script");
  });

  it("makes horizontally scrollable code blocks keyboard focusable", () => {
    const html = renderToStaticMarkup(
      <MarkdownRenderer content={'```yaml\napiVersion: autoscaling/v2\n```'} />,
    );

    expect(html).toContain('<pre tabindex="0"');
    expect(html).toContain('class="language-yaml code-highlight"');
  });
});

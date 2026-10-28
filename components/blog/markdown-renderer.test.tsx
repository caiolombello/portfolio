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

  it("renders registered figures with theme and narrow-screen variants", () => {
    const html = renderToStaticMarkup(
      <MarkdownRenderer
        content={"![Diagrama](/images/posts/hub-and-spoke-aws/fluxo-rede.svg)"}
      />,
    );
    const base = "/images/posts/hub-and-spoke-aws/fluxo-rede";

    expect(html).toMatch(
      new RegExp(`<a href="${base}\\.svg" class="block [^"]*dark:hidden">`),
    );
    expect(html).toMatch(
      new RegExp(`<a href="${base}\\.dark\\.svg" class="[^"]*hidden dark:block">`),
    );
    expect(html).toContain(
      `<source media="(max-width: 639px)" srcSet="${base}.mobile.svg"`,
    );
    expect(html).toContain(`srcSet="${base}.mobile.dark.svg"`);
    expect(html.match(/<img /g)).toHaveLength(2);
    expect(html.match(/alt="Diagrama"/g)).toHaveLength(2);
    expect(html.match(/loading="lazy"/g)).toHaveLength(2);
    expect(html).toMatch(/<img src="[^"]+\.svg" width="\d+" height="\d+"/);
    expect(html).toContain("(abre a figura em tamanho real)");
  });

  it("does not nest links when Markdown links a registered figure", () => {
    const src = "/images/posts/hub-and-spoke-aws/fluxo-rede.svg";
    const html = renderToStaticMarkup(
      <MarkdownRenderer content={`[![Diagrama](${src})](${src})`} />,
    );

    expect(html.match(/<a /g)).toHaveLength(2);
    expect(html).not.toMatch(/<a [^>]*>(?:(?!<\/a>).)*<a /);
  });

  it("keeps regular Markdown links", () => {
    const html = renderToStaticMarkup(
      <MarkdownRenderer content={'[docs](https://example.com "Docs")'} />,
    );

    expect(html).toContain('<a href="https://example.com" title="Docs">docs</a>');
  });

  it("lazy-loads unregistered Markdown images", () => {
    const html = renderToStaticMarkup(
      <MarkdownRenderer content={"![Foto](/images/foto.webp)"} language="en" />,
    );

    expect(html).toContain(
      '<img src="/images/foto.webp" alt="Foto" loading="lazy" decoding="async"/>',
    );
    expect(html).not.toContain("<picture");
  });

  it("makes horizontally scrollable code blocks keyboard focusable", () => {
    const html = renderToStaticMarkup(
      <MarkdownRenderer content={'```yaml\napiVersion: autoscaling/v2\n```'} />,
    );

    expect(html).toContain('<pre tabindex="0"');
    expect(html).toContain('class="language-yaml code-highlight"');
  });
});

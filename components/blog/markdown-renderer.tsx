import { isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";

import BlogFigure from "./blog-figure";
import CodeBlock from "./code-block";
import { getBlogFigure } from "@/lib/blog-figures";
import type { SiteLocale } from "@/lib/request-locale";

/** True when a Markdown link wraps only a registered figure image. */
function wrapsFigure(node: ExtraProps["node"]): boolean {
  const content =
    node?.children.filter(
      (child) => child.type !== "text" || child.value.trim() !== "",
    ) ?? [];
  const [only] = content;
  return (
    content.length === 1 &&
    only.type === "element" &&
    only.tagName === "img" &&
    getBlogFigure(only.properties?.src) !== undefined
  );
}

interface MarkdownRendererProps {
  content: string;
  language?: SiteLocale;
}

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }
  return "";
}

export default function MarkdownRenderer({
  content,
  language = "pt",
}: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none dark:prose-invert md:prose-lg prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-img:rounded-xl prose-img:border prose-a:text-brand prose-a:underline-offset-4 prose-li:marker:text-brand prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        components={{
          table: ({ children }) => (
            <div
              className="my-6 max-w-full overflow-x-auto"
              role="group"
              aria-label={
                language === "pt"
                  ? "Tabela com rolagem horizontal"
                  : "Scrollable table"
              }
              tabIndex={0}
            >
              <table className="my-0">{children}</table>
            </div>
          ),
          // A registered figure renders its own link, so a Markdown link around
          // it is dropped to avoid nested <a> elements.
          a: ({ node, children, ...props }) =>
            wrapsFigure(node) ? <>{children}</> : <a {...props}>{children}</a>,
          img: ({ src, alt = "", title }) => {
            const figure = getBlogFigure(src);
            if (figure) {
              return <BlogFigure figure={figure} alt={alt} language={language} />;
            }
            if (typeof src !== "string") {
              return null;
            }
            // Lazy loading also stops React from preloading body images
            // alongside the cover.
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                title={title}
                loading="lazy"
                decoding="async"
              />
            );
          },
          pre: ({ children }) => (
            <CodeBlock
              code={getTextContent(children).replace(/\n$/, "")}
              language={language}
            >
              {children}
            </CodeBlock>
          ),
        }}
        rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

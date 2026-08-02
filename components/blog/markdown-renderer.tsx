import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";

import CodeBlock from "./code-block";
import type { SiteLocale } from "@/lib/request-locale";

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
    <div className="prose prose-slate mx-auto max-w-4xl prose-headings:scroll-mt-24 prose-headings:tracking-[-0.02em] prose-headings:text-foreground prose-h2:mt-14 prose-h2:border-b prose-h2:border-border/70 prose-h2:pb-3 prose-a:font-medium prose-a:text-gold prose-a:decoration-gold/40 prose-a:underline-offset-4 prose-blockquote:border-gold prose-blockquote:bg-secondary/40 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:not-italic prose-li:marker:text-gold prose-p:leading-8 prose-pre:bg-[#0f141c] prose-pre:text-slate-100 dark:prose-invert">
      <ReactMarkdown
        components={{
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

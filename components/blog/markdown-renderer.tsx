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
    <div className="prose max-w-none dark:prose-invert md:prose-lg prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-img:rounded-xl prose-img:border prose-a:text-brand prose-a:underline-offset-4 prose-li:marker:text-brand prose-pre:bg-transparent prose-pre:p-0">
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

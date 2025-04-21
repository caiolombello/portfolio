"use client";

import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "@/lib/prism-languages";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  inline?: boolean;
  className?: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [
          rehypePrism,
          {
            ignoreMissing: true,
            showLineNumbers: true,
            aliases: {
              py: "python",
              python3: "python",
              py3: "python",
            },
          },
        ],
      ]}
      components={{
        code: function Code({ inline, className, children, ...props }: CodeBlockProps) {
          // Normalize the language class
          const match = /language-(\w+)/.exec(className || "");
          const lang = match ? match[1].toLowerCase() : "";

          // Map common Python variations to 'python'
          const normalizedLang = lang === "js"
            ? "javascript"
            : lang === "py"
            ? "python"
            : lang;

          const finalClassName = normalizedLang
            ? `language-${normalizedLang}`
            : className;

          return !inline && match ? (
            <pre className={`${finalClassName} line-numbers`}>
              <code className={finalClassName} {...props}>
                {String(children).replace(/\n$/, "")}
              </code>
            </pre>
          ) : (
            <code className={finalClassName} {...props}>
              {children}
            </code>
          );
        },
        pre: function Pre({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
          return <pre {...props}>{children}</pre>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

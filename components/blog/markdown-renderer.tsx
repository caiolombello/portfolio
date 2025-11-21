'use client';

import { useEffect } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';

// Importar as linguagens necessárias para o Prism
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-markdown';

// Estilos do Prism (escolha um tema)
import 'prismjs/themes/prism-tomorrow.css'; // ou outro tema de sua preferência

interface MarkdownRendererProps {
  content: string;
}

// Configurar o 'marked' para usar o Prism para destaque de sintaxe
marked.use({
  renderer: {
    code({ text, lang }) {
      const language = lang || 'text';
      if (Prism.languages[language]) {
        return `<pre class="language-${language}"><code class="language-${language}">${Prism.highlight(text, Prism.languages[language], language)}</code></pre>`;
      }
      return `<pre class="language-text"><code class="language-text">${text}</code></pre>`;
    }
  }
});

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const getMarkdownText = () => {
    const rawMarkup = marked.parse(content) as string;
    return { __html: rawMarkup };
  };

  return (
    <div
      className="prose prose-invert max-w-none prose-headings:text-gold prose-a:text-gold prose-pre:bg-transparent prose-pre:p-0"
      dangerouslySetInnerHTML={getMarkdownText()}
    />
  );
}

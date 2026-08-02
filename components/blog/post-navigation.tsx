import type { Post } from "@/types/blog";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogCopy } from "@/lib/blog-copy";
import { getLocalizedPost } from "@/lib/blog-post";

interface PostNavigationProps {
  previousPost?: Post;
  nextPost?: Post;
  lang: "pt" | "en";
}

export default function PostNavigation({
  previousPost,
  nextPost,
  lang,
}: PostNavigationProps) {
  const copy = getBlogCopy(lang);
  const previous = previousPost ? getLocalizedPost(previousPost, lang) : undefined;
  const next = nextPost ? getLocalizedPost(nextPost, lang) : undefined;

  return (
    <nav className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label={lang === "en" ? "Article navigation" : "Navegação entre artigos"}>
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="group flex min-w-0 items-center gap-3 rounded-xl border border-border/70 p-4 text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.12em]">{copy.newerArticle}</p>
            <p className="mt-1 line-clamp-2 font-semibold text-foreground">{previous.title}</p>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex min-w-0 items-center justify-end gap-3 rounded-xl border border-border/70 p-4 text-right text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
        >
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.12em]">{copy.olderArticle}</p>
            <p className="mt-1 line-clamp-2 font-semibold text-foreground">{next.title}</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}

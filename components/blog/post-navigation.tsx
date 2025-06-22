import { Post } from "@/types/blog";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dictionary } from "@/app/i18n/dictionaries";

interface PostNavigationProps {
  previousPost?: Post;
  nextPost?: Post;
  dictionary: Dictionary;
  lang: string;
}

export default function PostNavigation({
  previousPost,
  nextPost,
  dictionary,
  lang,
}: PostNavigationProps) {
  return (
    <nav className="mt-12 flex justify-between border-t border-border pt-8">
      {previousPost ? (
        <Link
          href={`/blog/${lang === 'en' ? previousPost.slug_en : previousPost.slug_pt}`}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={20} />
          <div>
            <p className="text-sm">{dictionary.blog.previousPost}</p>
            <p className="font-semibold">{lang === 'en' ? previousPost.title_en : previousPost.title_pt}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {nextPost ? (
        <Link
          href={`/blog/${lang === 'en' ? nextPost.slug_en : nextPost.slug_pt}`}
          className="flex items-center gap-2 text-right text-muted-foreground transition-colors hover:text-gold"
        >
          <div>
            <p className="text-sm">{dictionary.blog.nextPost}</p>
            <p className="font-semibold">{lang === 'en' ? nextPost.title_en : nextPost.title_pt}</p>
          </div>
          <ArrowRight size={20} />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

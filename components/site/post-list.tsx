import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/app/i18n/settings";
import { getCopy } from "@/lib/locale/copy";
import { formatShortDate } from "@/lib/locale/format";
import type { PostView } from "@/lib/site-data";

export function PostList({
  locale,
  posts,
}: {
  locale: Locale;
  posts: PostView[];
}) {
  const copy = getCopy(locale);

  return (
    <ul className="divide-y divide-border/80 border-y border-border/80">
      {posts.map((post) => (
        <li key={post.slug} className="reveal">
          <Link
            href={`/blog/${post.slug}`}
            className="group grid gap-4 py-7 sm:grid-cols-[8.5rem_1fr] sm:gap-8 lg:grid-cols-[8.5rem_1fr_13rem]"
          >
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground sm:block">
              <time dateTime={post.date}>
                {formatShortDate(post.date, locale)}
              </time>
              <p className="sm:mt-1.5 sm:normal-case sm:tracking-normal">
                {post.readingTime} {copy.blog.readingTime}
              </p>
            </div>

            <div className="min-w-0">
              <h3 className="flex items-start gap-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-brand">
                <span className="text-balance">{post.title}</span>
                <ArrowUpRight
                  className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </h3>
              {post.summary && (
                <p className="mt-2 line-clamp-2 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              )}
              {post.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                  {post.tags.map((tag) => (
                    <li key={tag}>#{tag.toLowerCase()}</li>
                  ))}
                </ul>
              )}
            </div>

            {post.coverImage && (
              <div className="relative hidden aspect-[16/10] overflow-hidden rounded-xl border lg:block">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  sizes="208px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState } from "react";
import { Twitter, Linkedin, Facebook, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlogCopy } from "@/lib/blog-copy";
import type { SiteLocale } from "@/lib/request-locale";

interface ShareButtonsProps {
  title: string;
  url: string;
  language: SiteLocale;
}

export function ShareButtons({ title, url, language }: ShareButtonsProps) {
  const copy = getBlogCopy(language);
  const [status, setStatus] = useState<"copied" | "error" | null>(null);
  const encodedUrl = encodeURIComponent(url);
  const links = [
    {
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`,
      label: copy.shareX,
      Icon: Twitter,
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: copy.shareLinkedIn,
      Icon: Linkedin,
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label:
        language === "en" ? "Share on Facebook" : "Compartilhar no Facebook",
      Icon: Facebook,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm text-muted-foreground">{copy.share}:</span>
      {links.map(({ href, label, Icon }) => (
        <Button
          key={href}
          variant="ghost"
          size="icon"
          asChild
          className="hover:text-brand"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon size={18} aria-hidden="true" />
          </a>
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        onClick={copyLink}
        aria-label={copy.copyLink}
        className="hover:text-brand"
      >
        <LinkIcon size={18} aria-hidden="true" />
      </Button>
      <span className="text-sm text-muted-foreground" role="status">
        {status === "copied"
          ? copy.copied
          : status === "error"
            ? copy.copyFailed
            : ""}
      </span>
    </div>
  );
}

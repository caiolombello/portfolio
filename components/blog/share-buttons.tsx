"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Link as LinkIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const { language } = useLanguage();

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(language === "en" ? "Link copied!" : "Link copiado!");
    } catch (err) {
      toast.error(language === "en" ? "Failed to copy link" : "Falha ao copiar link");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">
        {language === "en" ? "Share:" : "Compartilhar:"}
      </span>

      <Button variant="ghost" size="icon" asChild className="hover:text-[#1DA1F2]">
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
          <Twitter size={18} />
        </a>
      </Button>

      <Button variant="ghost" size="icon" asChild className="hover:text-[#0A66C2]">
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Linkedin size={18} />
        </a>
      </Button>

      <Button variant="ghost" size="icon" asChild className="hover:text-[#1877F2]">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <Facebook size={18} />
        </a>
      </Button>

      <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy Link">
        <LinkIcon size={18} />
      </Button>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";

interface PostLanguageHandlerProps {
  slugEn: string;
  slugPt: string;
}

export default function PostLanguageHandler({
  slugEn,
  slugPt,
}: PostLanguageHandlerProps) {
  const { setAlternateLinks } = useLanguage();

  useEffect(() => {
    if (setAlternateLinks) {
      setAlternateLinks({
        en: `/blog/${slugEn}`,
        pt: `/blog/${slugPt}`,
      });
    }

    // Cleanup on unmount
    return () => {
      if (setAlternateLinks) {
        setAlternateLinks({});
      }
    };
  }, [slugEn, slugPt, setAlternateLinks]);

  return null;
}

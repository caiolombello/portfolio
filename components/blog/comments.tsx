"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/language-context";

export default function Comments() {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div className="mt-10 pt-10 border-t">
      <Giscus
        id="comments"
        repo="caiobarbieri/portfolio"
        repoId="R_kgDOLJ_YyA"
        category="Announcements"
        categoryId="DIC_kwDOLJ_YyM4Ccw_u"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "dark" : "light"}
        lang={language}
        loading="lazy"
      />
    </div>
  );
}

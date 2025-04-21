"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { CmsWindow } from "@/types/cms";

interface PreviewWrapperProps {
  children: React.ReactNode;
  locale?: string;
}

export function PreviewWrapper({
  children,
  locale = "en",
}: PreviewWrapperProps) {
  useEffect(() => {
    // Register the preview component with Decap CMS
    if (typeof window !== "undefined" && "CMS" in window) {
      const cms = (window as unknown as CmsWindow).CMS;
      cms.registerPreviewStyle("/styles/preview.css");
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="cms-preview" data-locale={locale}>
        {children}
      </div>
    </ThemeProvider>
  );
}

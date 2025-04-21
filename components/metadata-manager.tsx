"use client";

import { useEffect } from "react";
import Script from "next/script";

interface MetadataManagerProps {
  jsonLd?: Record<string, unknown>;
  structuredData?: Array<Record<string, unknown>>;
}

export function MetadataManager({
  jsonLd,
  structuredData,
}: MetadataManagerProps) {
  useEffect(() => {
    // Update canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", window.location.href);
    }

    // Update language alternates
    const alternates = document.querySelectorAll('link[rel="alternate"]');
    alternates.forEach((alternate) => {
      const hrefLang = alternate.getAttribute("hreflang");
      if (hrefLang) {
        const path = window.location.pathname.split("/").slice(2).join("/");
        alternate.setAttribute(
          "href",
          `${window.location.origin}/${hrefLang}/${path}`,
        );
      }
    });
  }, []);

  return (
    <>
      {/* Structured Data */}
      {jsonLd && (
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Multiple Structured Data Items */}
      {structuredData?.map((data, index) => (
        <Script
          key={index}
          id={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}

"use client";

import Script from "next/script";
import { useEffect } from "react";

export function Analytics() {
  const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "8f7cbf98-45b4-49b3-83dd-7f398d47c925";
  const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL || "https://cloud.umami.is/script.js";
  const VERCEL_SPEED_INSIGHTS = process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS !== "false";

  useEffect(() => {
    // Handle analytics load errors silently
    window.addEventListener("error", (e) => {
      if (e.filename?.includes("umami") || e.filename?.includes("speed-insights")) {
        e.preventDefault();
        console.debug("Analytics script blocked or failed to load");
      }
    });
  }, []);

  return (
    <>
      {/* Umami Analytics */}
      <Script
        src={UMAMI_URL}
        data-website-id={UMAMI_WEBSITE_ID}
        strategy="lazyOnload"
        data-domains="caio.lombello.com"
        data-cache="true"
      />

      {/* Vercel Speed Insights */}
      {VERCEL_SPEED_INSIGHTS && (
        <Script
          src="/_vercel/speed-insights/script.js"
          strategy="lazyOnload"
        />
      )}
    </>
  );
} 
"use client";

import Script from "next/script";
import { useEffect } from "react";

export function Analytics() {
  const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "8f7cbf98-45b4-49b3-83dd-7f398d47c925";
  const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL || "https://cloud.umami.is/script.js";
  const VERCEL_SPEED_INSIGHTS = process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS !== "false";
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  useEffect(() => {
    let retryCount = 0;
    
    const handleScriptError = (e: ErrorEvent) => {
      if (e.filename?.includes("umami") || e.filename?.includes("speed-insights")) {
        e.preventDefault();
        
        // Only retry if not blocked by client
        if (!e.message?.includes("ERR_BLOCKED_BY_CLIENT") && retryCount < MAX_RETRIES) {
          retryCount++;
          console.debug(`Analytics script failed to load, retrying (${retryCount}/${MAX_RETRIES})...`);
          
          setTimeout(() => {
            const script = document.createElement("script");
            script.src = e.filename;
            script.async = true;
            document.body.appendChild(script);
          }, RETRY_DELAY);
        } else {
          console.debug("Analytics script blocked or failed to load after retries");
        }
      }
    };

    window.addEventListener("error", handleScriptError);
    return () => window.removeEventListener("error", handleScriptError);
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
        onError={(e) => {
          console.debug("Umami script failed to load:", e);
        }}
      />

      {/* Vercel Speed Insights */}
      {VERCEL_SPEED_INSIGHTS && (
        <Script
          src="/_vercel/speed-insights/script.js"
          strategy="lazyOnload"
          onError={(e) => {
            console.debug("Speed Insights script failed to load:", e);
          }}
        />
      )}
    </>
  );
} 
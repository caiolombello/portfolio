"use client";

import Script from "next/script";

export function Analytics() {
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id="8f7cbf98-45b4-49b3-83dd-7f398d47c925"
      strategy="lazyOnload"
    />
  );
} 
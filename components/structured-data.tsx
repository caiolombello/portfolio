import { generateJsonLd } from "@/lib/site-metadata";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={generateJsonLd(data)}
      key="structured-data"
    />
  );
}

// Example usage:
// <StructuredData data={generateBlogPostJsonLd({ ... })} />

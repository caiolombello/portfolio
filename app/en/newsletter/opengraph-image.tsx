import { createOgImage } from "@/lib/og-image";
import { getNewsletterSeoCopy } from "@/lib/newsletter-seo";

const copy = getNewsletterSeoCopy("en");

export const alt = copy.image.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    ...copy.image,
    path: "/en/newsletter",
  });
}

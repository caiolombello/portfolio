import { createOgImage } from "@/lib/og-image";

export const alt = "Contact Caio Barbieri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Contact",
    title: "Let's talk about platforms that need to last.",
    description:
      "Professional opportunities, platform challenges and a second perspective on reliability.",
    tags: ["DevOps", "SRE", "Cloud Native"],
    path: "/en/contact",
  });
}

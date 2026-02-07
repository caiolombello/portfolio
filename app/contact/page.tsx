import Contact from "@/components/contact";
import { generatePageMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("Contact");
}

export default function ContactPage() {
  return <Contact />;
}

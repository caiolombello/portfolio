import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Caio Barbieri",
  description: "Projects and Portfolio",
};

export default function PortfolioPage() {
  redirect("/portfolio/page/1");
}

import { generateMetadata } from "./metadata";

export { generateMetadata };

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    page: string;
  }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  await params; // Ensure params are resolved
  return children;
}

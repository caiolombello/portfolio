import { Suspense } from "react";
import { BlogGrid } from "@/components/blog-grid";
import { loadPosts } from "@/lib/data";
import { PostSkeleton } from "@/components/ui/loading-skeleton";

export const metadata = {
  title: "Blog | Caio Barbieri",
  description:
    "Artigos sobre DevOps, Cloud, Kubernetes e desenvolvimento de software",
};

async function BlogContent() {
  const posts = await loadPosts();
  return <BlogGrid posts={posts} />;
}

export default function BlogPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-12 text-center text-4xl font-bold">Blog</h1>
      <Suspense fallback={<PostSkeleton />}>
        <BlogContent />
      </Suspense>
    </div>
  );
}

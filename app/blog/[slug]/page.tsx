
"use client";

import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { useEffect, useState } from "react";
import type { Post } from "@/types";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPost({ params }: PageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      const { slug: slugParam } = await params;
      setSlug(slugParam);
    };
    initPage();
  }, [params]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/public/posts/${slug}`);
        if (response.ok) {
          const { post: postData } = await response.json();
          setPost(postData);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error loading post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}

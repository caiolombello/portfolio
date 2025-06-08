"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({
  className,
  count = 1,
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("animate-pulse rounded-md bg-muted", className)}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="space-y-3">
        <LoadingSkeleton className="h-5 w-2/3" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-8 w-full" />
      <LoadingSkeleton className="h-6 w-2/3" />
      <LoadingSkeleton className="h-96 w-full" />
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function ProjectSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-8 w-full" />
      <LoadingSkeleton className="h-6 w-2/3" />
      <LoadingSkeleton className="h-80 w-full" />
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import About from "./about";
import { AboutSkeleton } from "./loading-skeleton";

export default function HomeWithLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AboutSkeleton />;
  }

  return <About />;
} 
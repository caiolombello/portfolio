"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

interface BlogImageProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  size?: "small" | "large";
}

export function BlogImage({ 
  src, 
  alt, 
  className = "", 
  priority = false, 
  fill = false,
  width,
  height,
  size = "small"
}: BlogImageProps) {
  const [imageError, setImageError] = useState(false);
  const { language } = useLanguage();

  const handleImageError = () => {
    setImageError(true);
  };

  const showPlaceholder = !src || imageError;

  if (showPlaceholder) {
    const isLarge = size === "large";
    const iconSize = isLarge ? "w-16 h-16" : "w-12 h-12";
    const textSize = isLarge ? "text-sm" : "text-xs";
    const gradientIntensity = isLarge ? "from-gold/30 to-gold/10" : "from-gold/20 to-gold/5";
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradientIntensity} rounded-md flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <svg
            className={`${iconSize} mx-auto mb-2 opacity-50`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Blog image placeholder"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16l4-4 4 4m-4-8h.01"
            />
          </svg>
          <p className={`${textSize} opacity-70`}>
            {isLarge 
              ? (language === "en" ? "Blog Post Image" : "Imagem do Artigo")
              : (language === "en" ? "Blog Post" : "Artigo do Blog")
            }
          </p>
        </div>
      </div>
    );
  }

  if (!src) {
    return null;
  }

  return (
    <Image 
      src={src || ""}
      alt={alt}
      className={className}
      priority={priority}
      onError={handleImageError}
      {...(fill ? { fill: true } : { width, height })}
    />
  );
} 
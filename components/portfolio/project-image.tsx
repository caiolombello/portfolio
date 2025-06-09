"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import OptimizedImage from "@/components/ui/optimized-image";

interface ProjectImageProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  size?: "small" | "large";
}

export function ProjectImage({ 
  src, 
  alt, 
  className = "", 
  priority = false, 
  fill = false,
  width,
  height,
  size = "small"
}: ProjectImageProps) {
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
    const gradientIntensity = isLarge ? "from-blue-500/30 to-purple-500/10" : "from-blue-500/20 to-purple-500/5";
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradientIntensity} rounded-md flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <svg
            className={`${iconSize} mx-auto mb-2 opacity-50`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Project image placeholder"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <p className={`${textSize} opacity-70`}>
            {isLarge 
              ? (language === "en" ? "Project Preview" : "Preview do Projeto")
              : (language === "en" ? "Project" : "Projeto")
            }
          </p>
        </div>
      </div>
    );
  }

  if (!src) {
    return null;
  }

  // Check if src is external URL (use empty placeholder for external URLs)
  const isExternalUrl = src && (src.startsWith('http://') || src.startsWith('https://'));
  const shouldUseBlur = !isExternalUrl && width && height;

  return (
    <OptimizedImage 
      src={src || ""}
      alt={alt}
      className={className}
      priority={priority}
      fill={fill}
      width={width}
      height={height}
      quality={90}
      placeholder={shouldUseBlur ? "blur" : "empty"}
      sizes={fill
        ? (size === "large" 
          ? "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw")
        : undefined
      }
    />
  );
} 
"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onClick?: () => void;
  unoptimized?: boolean;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  width,
  height,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onClick,
  unoptimized = false,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Default sizes for responsive images
  const defaultSizes = fill 
    ? "100vw"
    : sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.3"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`
    ).toString('base64')}`;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg",
          fill ? "absolute inset-0" : "w-full h-full",
          className
        )}
      >
        <div className="text-gray-500 dark:text-gray-400 text-center p-4">
          <svg 
            className="w-8 h-8 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm">Imagem não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", !fill && "inline-block")}>
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          onClick && "cursor-pointer",
          className
        )}
        priority={priority}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={defaultSizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={
          blurDataURL || 
          (placeholder === 'blur' && width && height 
            ? generateBlurDataURL(width, height) 
            : undefined
          )
        }
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        unoptimized={unoptimized}
        loading={loading}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse",
            fill ? "absolute inset-0" : "w-full h-full"
          )}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

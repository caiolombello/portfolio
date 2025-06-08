interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

// Helper function to generate optimized image URL
export function getOptimizedImageUrl(
  imagePath: string,
  options: ImageOptimizationOptions = {}
): string {
  const params = new URLSearchParams();
  params.set('path', imagePath);
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);
  if (options.fit) params.set('fit', options.fit);

  return `/api/images/optimize?${params.toString()}`;
}

export type { ImageOptimizationOptions }; 
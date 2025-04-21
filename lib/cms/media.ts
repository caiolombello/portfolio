import sharp from "sharp";
import { uploadToS3 } from "./storage";

interface OptimizedImage {
  regular: Buffer;
  thumbnail: Buffer;
  regularUrl: string;
  thumbnailUrl: string;
}

interface OptimizeOptions {
  regularWidth?: number;
  thumbnailSize?: number;
  quality?: number;
  preserveFormat?: boolean;
  format?: "webp" | "jpeg" | "png" | "avif";
  compression?: {
    effort?: number; // 0-6 for WebP/AVIF
    lossless?: boolean;
  };
}

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  regularWidth: 1200,
  thumbnailSize: 300,
  quality: 80,
  preserveFormat: false,
  format: "webp",
  compression: {
    effort: 4,
    lossless: false,
  },
};

export async function optimizeImage(
  input: Buffer | string,
  options: OptimizeOptions = {},
): Promise<OptimizedImage> {
  const imageBuffer =
    typeof input === "string" ? Buffer.from(input, "base64") : input;

  // Merge options with defaults
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  // Detect input format if preserving
  let outputFormat = finalOptions.format;
  let outputExtension = finalOptions.format;
  if (finalOptions.preserveFormat) {
    const metadata = await sharp(imageBuffer).metadata();
    const format = metadata.format;
    const isValidFormat = (f: string): f is "webp" | "jpeg" | "png" | "avif" =>
      ["webp", "jpeg", "png", "avif"].includes(f);

    if (format && isValidFormat(format)) {
      outputFormat = format;
      outputExtension = format;
    }
  }

  // Configure format-specific options
  const formatOptions = {
    quality: finalOptions.quality,
  } as
    | sharp.WebpOptions
    | sharp.JpegOptions
    | sharp.PngOptions
    | sharp.AvifOptions;

  if (outputFormat === "webp" || outputFormat === "avif") {
    Object.assign(formatOptions, {
      effort: finalOptions.compression.effort,
      lossless: finalOptions.compression.lossless,
    });
  }

  const [regular, thumbnail] = await Promise.all([
    // Regular size image
    sharp(imageBuffer)
      .resize(finalOptions.regularWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      })[outputFormat](formatOptions)
      .toBuffer(),

    // Thumbnail
    sharp(imageBuffer)
      .resize(finalOptions.thumbnailSize, finalOptions.thumbnailSize, {
        fit: "cover",
        position: "centre",
      })[outputFormat]({
        ...formatOptions,
        quality: Math.max(finalOptions.quality - 10, 60), // Slightly lower quality for thumbnails
      })
      .toBuffer(),
  ]);

  // Upload both versions to S3
  const timestamp = Date.now();
  const [regularUrl, thumbnailUrl] = await Promise.all([
    uploadToS3(
      regular,
      `${timestamp}-regular.${outputExtension}`,
      `image/${outputFormat}`,
    ),
    uploadToS3(
      thumbnail,
      `${timestamp}-thumbnail.${outputExtension}`,
      `image/${outputFormat}`,
    ),
  ]);

  return {
    regular,
    thumbnail,
    regularUrl,
    thumbnailUrl,
  };
}

export async function processAndUploadImage(
  file: File,
  options: OptimizeOptions = {},
): Promise<{
  regular: string;
  thumbnail: string;
}> {
  try {
    const buffer = await file.arrayBuffer();
    const optimized = await optimizeImage(Buffer.from(buffer), {
      preserveFormat: true, // Default to preserving original format
      ...options,
    });

    return {
      regular: optimized.regularUrl,
      thumbnail: optimized.thumbnailUrl,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}

export function generateImageUrl(
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  },
): string {
  // If the path is already a full URL (e.g., S3/CloudFront), return it as is
  if (path.startsWith("http")) {
    return path;
  }

  const url = new URL(path, process.env.NEXT_PUBLIC_SITE_URL);

  if (options?.width) {
    url.searchParams.set("w", options.width.toString());
  }
  if (options?.height) {
    url.searchParams.set("h", options.height.toString());
  }
  if (options?.quality) {
    url.searchParams.set("q", options.quality.toString());
  }

  return url.toString();
}

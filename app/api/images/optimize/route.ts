import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    // Get image path and optimization parameters
    const imagePath = searchParams.get('path');
    const width = searchParams.get('w') ? parseInt(searchParams.get('w')!) : undefined;
    const height = searchParams.get('h') ? parseInt(searchParams.get('h')!) : undefined;
    const quality = searchParams.get('q') ? parseInt(searchParams.get('q')!) : 85;
    const format = (searchParams.get('f') as ImageOptimizationOptions['format']) || 'webp';
    const fit = (searchParams.get('fit') as ImageOptimizationOptions['fit']) || 'cover';

    if (!imagePath) {
      return new NextResponse('Image path is required', { status: 400 });
    }

    // Construct full path to image
    const fullImagePath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if file exists
    try {
      await fs.access(fullImagePath);
    } catch {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Read and process image
    const imageBuffer = await fs.readFile(fullImagePath);
    let processedImage = sharp(imageBuffer);

    // Apply resizing if dimensions provided
    if (width || height) {
      processedImage = processedImage.resize(width, height, {
        fit,
        withoutEnlargement: true, // Don't upscale images
      });
    }

    // Apply format and quality settings
    let outputBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case 'avif':
        outputBuffer = await processedImage
          .avif({ quality, effort: 6 })
          .toBuffer();
        contentType = 'image/avif';
        break;
      case 'webp':
        outputBuffer = await processedImage
          .webp({ quality, effort: 6 })
          .toBuffer();
        contentType = 'image/webp';
        break;
      case 'jpeg':
        outputBuffer = await processedImage
          .jpeg({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/jpeg';
        break;
      case 'png':
        outputBuffer = await processedImage
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toBuffer();
        contentType = 'image/png';
        break;
      default:
        outputBuffer = await processedImage
          .webp({ quality, effort: 6 })
          .toBuffer();
        contentType = 'image/webp';
    }

    // Set cache headers for optimized images
    const cacheHeaders = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
      'Vary': 'Accept',
      'X-Image-Optimized': 'true',
      'X-Original-Size': imageBuffer.length.toString(),
      'X-Optimized-Size': outputBuffer.length.toString(),
      'X-Compression-Ratio': ((1 - outputBuffer.length / imageBuffer.length) * 100).toFixed(2) + '%',
    };

    return new NextResponse(outputBuffer, {
      headers: cacheHeaders,
    });

  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}

 